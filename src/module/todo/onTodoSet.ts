import axios from 'axios';
import {
  setBojHandle, setHome, setOwner, setUseAlarm,
} from '../../database/user';
import { getArg } from '../../etc/parseQuery';
import { replyDdokddul, replySuccess } from '../../etc/postMessage';
import { cstodoTestChannel } from '../../config';
import { TodoRouter } from '../router';
import { ReplyFailureCommand } from '../../command/replyFailure';

const negativeWords = ['off', 'no', 'none', 'false', '0', 'never'];

const onTodoSet: TodoRouter = async ({ event, user, query: { args } }) => {
  if (event.user !== user.owner && event.user !== 'UV6HYQD3J' && event.user !== 'UV8DYMMV5') {
    return new ReplyFailureCommand(event, user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const useDue = getArg(['-use-due', '--use-due', '-useDue', '--useDue'], args);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const usePriority = getArg(['-use-priority', '--use-priority', '-usePriority', '--usePriority'], args);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const useBar = getArg(['-use-bar', '--use-bar', '-useBar', '--useBar'], args);
  const useAlarm = getArg(['-use-alarm', '--use-alarm', '-useAlarm', '--useAlarm'], args);
  const rawOwner = getArg(['--owner'], args);
  const rawHome = getArg(['--home'], args);
  const bojHandle = getArg(['--boj'], args);

  if (typeof rawOwner === 'string' && (rawOwner.startsWith('<@') && rawOwner.endsWith('>'))) {
    const owner = rawOwner.slice(2, -1);
    if (user.owner) {
      await replyDdokddul(event, user, `저의 주인이 이미 <@${user.owner}>님으로 설정되어 있습니다!! 꼭 바꾸어야 한다면 <#${cstodoTestChannel}>에 말씀해주세요..`);
    } else {
      await setOwner(user.command, owner);
      await replySuccess(event, user, `저의 주인이 <@${owner}>님으로 설정되었습니다!`);
    }
  }

  // FIXME: channel 하이퍼링크 파싱할 것
  if (typeof rawHome === 'string') {
    const home = rawHome;
    if (event.channel !== home) {
      // eslint-disable-next-line no-console
      console.warn(`target ${home}과 event ${event.channel}이 다릅니다.`);
      await replyDdokddul(event, user, `이 명령어를 <#${home}>에서 직접 실행시켜주세요.. ㅠㅠ`);
    } else {
      await setHome(user.command, home);
      await replySuccess(event, user, `${user.name}님의 비서의 위치가 <#${home}>으로 설정되었습니다! ${user.name}님의 비서가 드리는 알림은 이 채널로 전달될 예정입니다..`);
      // eslint-disable-next-line no-console
      console.warn(`${user.command} 봇의 위치가 <#${home}>으로 설정되었습니다.`);
    }
  }

  if (typeof useAlarm === 'string') {
    if (negativeWords.find((x) => useAlarm === x)) {
      setUseAlarm(user.command, 'never');
      await replySuccess(event, user, `앞으로 ${user.name}님의 할 일의 마감 시간에 알림을 드리지 않겠습니다..`);
    } else {
      setUseAlarm(user.command, 'always');
      await replySuccess(event, user, `앞으로 ${user.name}님의 할 일의 마감 시간에 알림을 드리겠습니다!`);
    }
  }

  if (typeof bojHandle === 'string') {
    const bojResp = await (async () => {
      try {
        const resp = await axios.get(`https://acmicpc.net/user/${bojHandle}`);
        return resp.status;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return 500;
      }
    })();
    if (bojResp !== 200) {
      await replyDdokddul(event, user, `${bojHandle}이라는 유저가 백준에서 확인되지 않아 똑떨이에요...`);
    } else {
      const isChanged = await setBojHandle(user.command, bojHandle);
      if (isChanged) {
        await replySuccess(event, user, `${user.name}님의 백준 아이디가 ${bojHandle}로 설정되었습니다!`);
        // eslint-disable-next-line no-console
        console.warn(`${user.name}님의 백준 아이디가 ${bojHandle}로 설정되었습니다. 실제와 다른 경우 제재가 가해질 수 있습니다.`);
      } else {
        replyDdokddul(event, user, `${user.name}님의 백준 아이디는 이미 ${user.bojHandle!!}로 설정되어 있어요...`);
      }
    }
  }
  //    await replySuccess(event, user, message, 'default');
  return [];
};

export default onTodoSet;
