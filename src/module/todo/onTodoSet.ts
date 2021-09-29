import { UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { QueryType } from '../../etc/parseQuery';
import { replySuccess } from '../../etc/postMessage';

const onTodoSet = async (query: QueryType, event: any, user: UserType) => {
    
    let message = `${user.name}님의 할 일이 없습니다! ${emoji('add', user.theme)}`;
    
    await replySuccess(event, user, message, 'default');
    return;
}

export default onTodoSet;