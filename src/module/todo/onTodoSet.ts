import { setHome, setOwner, setUseAlarm, UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { getArg, QueryType } from '../../etc/parseQuery';
import { addEmoji, replyDdokddul, replySuccess } from '../../etc/postMessage';
import { cstodoTestChannel } from '../../config';

const negativeWords = ['off', 'no', 'none', 'false', '0', 'never'];

const onTodoSet = async ({ command, args }: QueryType, event: any, user: UserType) => {

    if (event.user !== user.owner && event.user !== 'UV6HYQD3J') {
        addEmoji(event, 'sad');
        return;
    }

    const useDue = getArg(['-use-due', '--use-due', '-useDue', '--useDue'], args);
    const usePriority = getArg(['-use-priority', '--use-priority', '-usePriority', '--usePriority'], args);
    const useBar = getArg(['-use-bar', '--use-bar', '-useBar', '--useBar'], args);
    const useAlarm = getArg(['-use-alarm', '--use-alarm', '-useAlarm', '--useAlarm'], args);
    const rawOwner = getArg(['--owner'], args);
    const rawHome = getArg(['--home'], args);

    if (typeof rawOwner === 'string' && (rawOwner.startsWith('<@') && rawOwner.endsWith('>'))) {
        const owner = rawOwner.slice(2, -1);
        if (user.owner) {
            await replyDdokddul(event, user, `저의 주인이 이미 <@${user.owner}>님으로 설정되어 있습니다!! 꼭 바꾸어야 한다면 <#${cstodoTestChannel}>에 말씀해주세요..`)
        } else {
            await setOwner(user.command, owner);
            await replySuccess(event, user, `저의 주인이 <@${owner}>님으로 설정되었습니다!`);
        }
    }

    if (typeof rawHome === 'string' && (rawHome.startsWith('<#') && rawHome.endsWith('>'))) {
        const home = rawHome.slice(2, -1);
        if (event.channel !== home) {
            console.warn(`target ${home}과 event ${event.channel}이 다릅니다.`);
            await replyDdokddul(event, user, `이 명령어를 <#${home}>에서 직접 실행시켜주세요.. ㅠㅠ`);
        } else {
            await setHome(user.command, home);
            await replySuccess(event, user, `${user.name}님의 비서의 위치가 <#${home}>으로 설정되었습니다! ${user.name}님의 비서가 드리는 알림은 이 채널로 전달될 예정입니다..`);            
        }
    }

    if (typeof useAlarm === 'string') {
        if (negativeWords.find((x) => useAlarm === x)) {
            setUseAlarm(user.command, 'never');
            await replySuccess(event, user, `앞으로 ${user.name}님의 할 일의 마감 시간에 알림을 드리지 않겠습니다..`);
        }
        else {
            setUseAlarm(user.command, 'always');
            await replySuccess(event, user, `앞으로 ${user.name}님의 할 일의 마감 시간에 알림을 드리겠습니다!`);
        }
    }
    
//    await replySuccess(event, user, message, 'default');
    return;
}

export default onTodoSet;