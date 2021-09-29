import { setHome, setOwner, UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { getArg, QueryType } from '../../etc/parseQuery';
import { addEmoji, replyDdokddul, replySuccess } from '../../etc/postMessage';
import { cstodoTestChannel } from '../../config';

const onTodoSet = async ({ command, args }: QueryType, event: any, user: UserType) => {

    if (event.user !== user.owner && event.user !== 'UV6HYQD3J') {
        addEmoji(event, 'sad');
        return;
    }

    const useDue = getArg(['-use-due', '--use-due', '-useDue', '--useDue'], args);
    const usePriority = getArg(['-use-priority', '--use-priority', '-usePriority', '--usePriority'], args);
    const useBar = getArg(['-use-bar', '--use-bar', '-useBar', '--useBar'], args);
    const rawOwner = getArg(['--owner'], args);
    const rawHome = getArg(['--home'], args);

    if (typeof rawOwner === 'string' && (rawOwner.startsWith('<@') && rawOwner.endsWith('>'))) {
        const owner = rawOwner.slice(2, -1);
        await setOwner(user.command, owner);
        if (user.owner) {
            await replyDdokddul(event, user, `저의 주인이 이미 <@${user.owner}>님으로 설정되어 있습니다!! 꼭 바꾸어야 한다면 <#${cstodoTestChannel}>에 말씀해주세요..`)
        } else {
            await replySuccess(event, user, `저의 주인이 <@${owner}>님으로 설정되었습니다!`);
        }
    }

    if (typeof rawHome === 'string' && (rawHome.startsWith('<#') && rawHome.endsWith('>'))) {
        const home = rawHome.slice(2, -1);
        await setHome(user.command, home);
        if (event.channel !== home)
            await replyDdokddul(event, user, `이 명령어를 <#${event.channel}>에서 직접 실행시켜주세요.. ㅠㅠ`);
        else 
            await replySuccess(event, user, `${user.name}님의 비서의 위치가 <#${home}>으로 설정되었습니다! 추후 봇 관련 큰 변화가 있을 때 이 채널로 전달될 예정입니다..`);
    }
    
//    await replySuccess(event, user, message, 'default');
    return;
}

export default onTodoSet;