import { webClient } from '../command';
import { chooseProblem, validateProblem, validateThenChooseProblem } from '../module/onDailyGreenGold';
import onDailyProblem from '../module/onDailyProblem';
import checkAllTodoAlarms from './checkAllTodoAlarms';

const cstodoTestChannel = 'C01JER4T7AN';

interface FunctionNameData {
  name: string;
  callback: (fireDate: Date, ...params: string[]) => void;
}

export const functionNameMap: FunctionNameData[] = [
  {
    name: 'test',
    callback: async (fireDate) => {
      await webClient.chat.postMessage({
        text: `현재 시간: ${fireDate}. 이 메시지는 25초마다 한 번씩 발송됩니다.`,
        icon_emoji: ':cs71107:',
        channel: cstodoTestChannel,
        username: 'cs71107',
      });
    },
  },
  {
    name: 'giveGreenProblem',
    callback: () => chooseProblem('greentodo'),
  },
  {
    name: 'checkGreenProblem',
    callback: () => validateProblem('greentodo'),
  },
  {
    name: 'giveAhgusProblem',
    callback: () => chooseProblem('motodo'),
  },
  {
    name: 'checkAhgusProblem',
    callback: () => validateProblem('motodo'),
  },
  {
    name: 'checkCsDiamond',
    callback: () => onDailyProblem(),
  },
  {
    name: 'checkAllTodoAlarms',
    callback: (fireDate) => checkAllTodoAlarms(fireDate),
  },
  {
    name: 'giveHW',
    callback: (fireDate, ...params) => chooseProblem(params[0]),
  },
  {
    name: 'checkHW',
    callback: (fireDate, ...params) => validateProblem(params[0]),
  },
  {
    name: 'checkAndGiveHW',
    callback: (fireDate, ...params)  => validateThenChooseProblem(params[0]),
  }
];

export const getFunctionByName = (name: string) => {
  const data = functionNameMap.find((data) => data.name === name);

  if (data === undefined) {
    return undefined;
  }

  return data.callback;
};
