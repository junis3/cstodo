import { setHome, setOwner, UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { getArg, QueryType } from '../../etc/parseQuery';
import { replyDdokddul, replySuccess } from '../../etc/postMessage';
import { cstodoTestChannel } from '../../config';

const onTodoSet = async ({ command, args }: QueryType, event: any, user: UserType) => {

    if (event.user !== user.owner)
        return;

    const useDue = getArg(['-use-due', '--use-due', '-useDue', '--useDue'], args);
    const usePriority = getArg(['-use-priority', '--use-priority', '-usePriority', '--usePriority'], args);
    const useBar = getArg(['-use-bar', '--use-bar', '-useBar', '--useBar'], args);
    const owner = getArg(['--owner'], args);
    const home = getArg(['--home'], args);

    if (typeof owner === 'string') {
        await setOwner(user.command, owner);
        if (user.owner) {
            await replyDdokddul(event, user, `저의 주인이 이미 <@${user.owner}>님으로 설정되어 있습니다!! 꼭 바꾸어야 한다면 <#${cstodoTestChannel}>에 말씀해주세요..`)
        } else {
            await replySuccess(event, user, `저의 주인이 <@${owner}>님으로 설정되었습니다!`);
        }
    }

    if (typeof home === 'string') {
        await setHome(user.command, home);
        await replySuccess(event, user, `${user.name}님의 비서의 위치가 <#${home}>으로 설정되었습니다! 추후 봇 관련 큰 변화가 있을 때 이 채널로 전달될 예정입니다..`);
    }
    
//    await replySuccess(event, user, message, 'default');
    return;
}

export default onTodoSet;