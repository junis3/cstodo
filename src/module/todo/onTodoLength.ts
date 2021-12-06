import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replySuccess } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import { SlackMessageEvent } from '../../slack/event';

  
const onTodoLength = async (query: QueryType, event: SlackMessageEvent, user: UserType) => {
    const cstodo = await getCstodos(user.id);

    await replySuccess(event, user, `와... ${user.name}님이 할 일이 총 ${cstodo.length} 개가 있어요... ${emoji('cs')}`);
}

export default onTodoLength;