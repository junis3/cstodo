import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';

  
const onTodoLength = async (query: QueryType, event: any, user: UserType) => {
    const cstodo = await getCstodos(user.id);

    await replyMessage(event, user, {
        username: `${user.name}님의 비서`,
        text: `와... ${user.name}님이 할 일이 총 ${cstodo.length} 개가 있어요... ${emoji('cs')}`,
        channel: event.channel,
        icon_emoji: emoji('default', user.theme),
    });
}

export default onTodoLength;