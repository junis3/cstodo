import { admins, csGod, cstodoChannel, cstodoTestChannel } from '../config';
import onCode from './code';
import onTodo from './todo';
import onBar from './bar';
import onYourMark from './yourMark';
import onBamboo from './bamboo';
import { getUser } from '../database/user';
import { emoji } from '../etc/theme';
import { MessageRouter } from '../router';
import { ReplyMessageCommand } from '../command/ReplyMessageCommand';
import { ShutdownCommand } from '../command/ShutdownCommand';
import { ReplyFailureCommand } from '../command/ReplyFailureCommand';
import { PassCommand } from '../command/PassCommand';
import { SerialCommand } from '../command/SerialCommand';
import { addMessage } from '../database/message';
import { getHuman, setMainUser, upsertHuman } from '../database/human';

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
      if (admins.find((x) => x === event.user)) {
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

  // human-oriented todo commands
  if (command === '$+') {
    await upsertHuman(event.user);
    if (tokens.length < 2) return new PassCommand();
    const mainUser = tokens[1].toLowerCase();
    const mainUserAdded = await setMainUser(event.user, mainUser);
    if (mainUserAdded) {
      return new ReplyMessageCommand(event, {
        text: `<@${event.user}>님의 비서실장을 ${mainUser}로 설정했어요! 이제 "${mainUser} ..."를 "$ ..."로 간편히 사용하세요.`,
        channel: event.channel,
        username: '구슬랙의 비서',
      });
    } else {
      return new ReplyMessageCommand(event, {
        text: `<@${event.user}>님의 비서실장을 ${mainUser}로 설정하는 데 실패했어요...`,
        channel: event.channel,
        username: '구슬랙의 똑떨한 비서',
      });
    }
  }
  if (command === '$') {
    const human = await getHuman(event.user);
    if (human === undefined || human.main_user === undefined) {
      await upsertHuman(event.user);
      return new ReplyMessageCommand(event, {
        text: `<@${event.user}>님은 비서실장을 지정하지 않아 똑떨이에요... "$+ cstodo"와 같이 비서실장을 설정해주세요.`,
        channel: event.channel,
        username: '구슬랙의 똑떨한 비서',
      });
    }
    const user = await getUser(human.main_user);
    if (user) {
      if (user.taskType === 'todo') return onTodo({ event, user });
      if (user.taskType === 'bar') {
        await onBar(event, user);
        return new PassCommand();
      }
    } else {
      return new ReplyMessageCommand(event, {
        text: `<@${event.user}>님의 비서실장 ${human.main_user}는 등록되지 않아 똑떨이에요... "$+ cstodo"와 같이 비서실장을 재설정해주세요.`,
        channel: event.channel,
        username: '구슬랙의 똑떨한 비서',
      });
    }
  }

  // normal todo command
  const user = await getUser(command);

  if (user) {
    if (user.taskType === 'todo') return onTodo({ event, user });
    if (user.taskType === 'bar') {
      await onBar(event, user);
      return new PassCommand();
    }
  }

  // Random blobaww
  let percentage = 0.0005;
  if (event.channel === cstodoChannel) percentage *= 2;
  if (event.user === csGod) percentage *= 2;

  const blobawwFired = Math.random() < percentage;

  if (event.command) addMessage({ event, blobawwFired });

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
