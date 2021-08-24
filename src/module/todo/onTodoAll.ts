

import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';

const onCstodoAll = async (event: any, user: UserType) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const cstodo = await getCstodos(user.id);

    let message = `${user.name}님의 할 일이 없습니다! ${emoji('add')}`;
    
    if (cstodo.length > 0) message = cstodo.map((todo, k) => `${k+1}. *${todo.content}*  ${timeToString(todo.due)}까지`).join('\n');

    await replyMessage(event, {
        username: `${user.name}님의 비서`,
        text: message,
        channel: event.channel,
        icon_emoji: emoji('default'),
    });
    return;
}

export default onCstodoAll;