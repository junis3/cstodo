import { csGod, cstodoChannel, cstodoTestChannel } from '../config';
import onCode from './code';
import onTodo from './todo';
import onBar from './bar';
import onYourMark from './yourMark';
import { getUser } from '../database/user';
import { emoji } from '../etc/theme';
import { MessageRouter } from '../router';
import { ReplyMessageCommand } from '../command/ReplyMessageCommand';
import { ShutdownCommand } from '../command/ShutdownCommand';
import { ReplyFailureCommand } from '../command/ReplyFailureCommand';
import { PassCommand } from '../command/PassCommand';
import { SerialCommand } from '../command/SerialCommand';

const turnOnTimestamp = new Date().getTime() / 1000;

// eslint-disable-next-line no-unused-vars
let lastUser: string;
let nowUser: string;

const onMessage: MessageRouter = async ({ event }) => {
  if (Number(event.ts) < turnOnTimestamp) return new PassCommand();
  if (!event.text || !event.user) return new PassCommand();
  if (event.thread_ts) return new PassCommand();

  if (nowUser !== event.user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lastUser = nowUser;
    nowUser = event.user;
  }

  const text: string = event.text.replace(/[^ -~가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
  const tokens = text.split(' ').filter((str) => str.length > 0);

  if (tokens.length < 1) return new PassCommand();

  const command = tokens[0].toLowerCase();

  // Special commands

  if (event.channel === cstodoTestChannel) {
    if (command === 'restart') {
      if (event.user === 'UV6HYQD3J' || event.user === 'UV8DYMMV5') {
        return new SerialCommand(
          new ReplyMessageCommand(event, {
            text: `안녕히 계세요 여러분!
전 이 세상의 모든 굴레와 속박을 벗어 던지고 제 행복을 찾아 떠납니다!
여러분도 행복하세요~~!`,
            channel: event.channel,
          }),
          new ShutdownCommand(),
        );
      }
      return new ReplyFailureCommand(event);
    }
  }

  // if (command === 'echo' && tokens.length > 1) {
  // eslint-disable-next-line max-len
  //   if (tokens.length < 5 || !([0, 1, 2, 3, 4].every((i) => tokens[i].toLowerCase() === 'echo'))) {
  //     await runCommands(onEcho(event));
  //   }
  // }

  if (command === 'code' && tokens.length > 1) return onCode({ event });
  if (command === 'on') return onYourMark({ event });

  // Todo commands
  const user = await getUser(command);

  if (user) {
    if (user.taskType === 'todo') return onTodo({ event, user });
    if (user.taskType === 'bar') {
      await onBar(event, user);
      return new PassCommand();
    }
  }

  // Random blobaww
  let percentage = 0.00050;
  if (event.channel === cstodoChannel) percentage *= 2.5;
  if (event.user === csGod) percentage *= 2.5;

  const blobawwFired = Math.random() < percentage;

  //  addMessage({ event, blobawwFired });

  if (blobawwFired) {
    return new ReplyMessageCommand(event, {
      text: `역시 <@${event.user}>님이에요... ${emoji('aww')}`,
      channel: event.channel,
      username: 'cs71107',
    });
  }

  return new PassCommand();
};

export default onMessage;
