

import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';

const onCstodoAll = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const cstodo = await getCstodos();

    let message = cstodo.map((todo, k) => `${k+1}. *${todo.content}*  ${timeToString(todo.due)}까지`).join('\n');

    await replyMessage(event, {
        text: message,
        channel: event.channel,
        icon_emoji: emoji('default'),
    });
    return;
}

export default onCstodoAll;