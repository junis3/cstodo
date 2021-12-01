import { model, Schema, Document } from "mongoose";
import { scheduleJob } from "node-schedule";
import { HistoryType } from "./history";
import { getFunctionByName } from "../etc/functionNameMap";

export interface AlarmType {
    id: string,
    initialTime: number,
    repeatTime: number,
    function: string,
    params: string[],
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

export const getAlarms = async () => {
    return (await Alarm.find()).map((doc) => doc.toObject() as AlarmType);
}

export const addAlarm = async (alarm: Omit<AlarmType, "id">) => {
    await new Alarm(alarm).save();
}

export const removeAlarm = async (id: string) => {
    await Alarm.findOneAndRemove({ id }, { useFindAndModify: true });
}

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
            else if (fromTime < alarm.initialTime) return alarm.initialTime;
            return alarm.initialTime + alarm.repeatTime * Math.ceil((fromTime - alarm.initialTime) / alarm.repeatTime);
        }

        const callback = (fireDate: Date) => {
            const fireTime = fireDate.getTime();

            if (alarm.repeatTime > 0) {
                console.log(alarm.function);
                console.log(nextFireTime(fireTime+1));
                scheduleJob(nextFireTime(fireTime+1), callback);
            }
            
            getFunctionByName(alarm.function)(fireDate, ...alarm.params);            
        };

        console.log(alarm.function);
        console.log(nextFireTime(nowTime));
        scheduleJob(nextFireTime(nowTime), callback);
    })
}