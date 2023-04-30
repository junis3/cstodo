import { model, Schema, Document } from 'mongoose';
import { scheduleJob } from 'node-schedule';
import { getFunctionByName } from '../etc/functionNameMap';
import { validateThenChooseProblem } from '../module/onDailyGreenGold';
import { getAllUsers } from './user';

export interface AlarmType {
  id: string;
  initialTime: number;
  repeatTime: number;
  function: string;
  params: string[];
}

export type AlarmDocument = Document & AlarmType;

const alarmSchema = new Schema<AlarmDocument>({
  initialTime: Number,
  repeatTime: { type: Number, default: 0 },
  function: String,
  params: [String],
});

const Alarm = model('alarm', alarmSchema, 'alarms');
export default Alarm;

export const getAlarms = async () => (await Alarm.find()).map((doc) => doc.toObject() as AlarmType);

export const addAlarm = async (alarm: Omit<AlarmType, 'id'>) => {
  await new Alarm(alarm).save();
};

export const removeAlarm = async (id: string) => {
  await Alarm.findOneAndRemove({ id });
};

// This function MUST be executed EXACTLY once after bot execution
// for alarm function to properly work
export const initiateAlarms = async () => {
  const alarms = await getAlarms();
  const nowTime = new Date().getTime();

  alarms.forEach((alarm) => {
    if (alarm.initialTime < nowTime && alarm.repeatTime <= 0) {
      removeAlarm(alarm.id);
      return;
    }

    const nextFireTime = (fromTime: number) => {
      if (alarm.repeatTime <= 0) return alarm.initialTime;
      if (fromTime < alarm.initialTime) return alarm.initialTime;
      return (
        alarm.initialTime +
        alarm.repeatTime * Math.ceil((fromTime - alarm.initialTime) / alarm.repeatTime)
      );
    };

    const callback = (fireDate: Date) => {
      const fireTime = fireDate.getTime();

      if (alarm.repeatTime > 0) scheduleJob(nextFireTime(fireTime + 1), callback);

      const f = getFunctionByName(alarm.function);

      if (f) f(fireDate, ...alarm.params);
    };

    scheduleJob(nextFireTime(nowTime), callback);
  });

  const users = await getAllUsers();
  users.forEach((user) => {
    if (!user.initialTime || user.initialTime === 0 || !user.repeatTime || user.repeatTime <= 0)
      return;

    const day_per_milsec = 86400000;
    const nextFireTime = (fromTime: number) => {
      const repeatMilsec = user.repeatTime!! * day_per_milsec;
      if (repeatMilsec <= 0 || fromTime < user.initialTime!!) return user.initialTime!!;
      return (
        user.initialTime!! +
        repeatMilsec * Math.ceil((fromTime - user.initialTime!!) / repeatMilsec)
      );
    };

    const callback = (fireDate: Date) => {
      const fireTime = fireDate.getTime();

      if (user.repeatTime!! > 0) scheduleJob(nextFireTime(fireTime + 1), callback);

      validateThenChooseProblem(user.command, true);
    };

    scheduleJob(nextFireTime(nowTime), callback);
  });
};
