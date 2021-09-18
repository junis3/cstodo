

import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replySuccess } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';
import { QueryType } from '../../etc/parseQuery';

const onTodoAll = async (query: QueryType, event: any, user: UserType) => {
    const cstodo = await getCstodos(user.id);

    let message = `${user.name}님의 할 일이 없습니다! ${emoji('add', user.theme)}`;
    
    if (cstodo.length > 0) message = cstodo.map((todo, k) => `> ${k+1}. *${todo.content}*  ${timeToString(todo.due)}까지`).join('\n');

    await replySuccess(event, user, message, 'default');
    return;
}

export default onTodoAll;