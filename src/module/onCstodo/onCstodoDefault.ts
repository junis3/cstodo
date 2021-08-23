import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];

const onCstodoDefault = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const allCstodo = await getCstodos();
    const cstodo = allCstodo.slice(0, 5);

    let message = cstodo.map((todo, k) => `${bulletEmoji[k]} *${todo.content}*  ${timeToString(todo.due)}까지`).join('\n');

    if (cstodo.length < allCstodo.length)
        message += `\n이 밖에도 할 일이 ${allCstodo.length - cstodo.length}개나 더 있어요... ${emoji('add')}`;

    await replyMessage(event, {
      text: message,
      channel: event.channel,
      icon_emoji: emoji('default'),
    });
    return;
}

export default onCstodoDefault;