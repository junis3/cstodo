import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';
import { QueryType } from '../../etc/parseQuery';

const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];

const onTodoDefault = async (query: QueryType, event: any, user: UserType) => {
    const allCstodo = await getCstodos(user.id);
    const cstodo = allCstodo.slice(0, 10);

    let message = `${user.name}님의 할 일이 없습니다! ${emoji('add')}`
    
    if (cstodo.length > 0)
        message = cstodo.map((todo, k) => `${bulletEmoji[k]} *${todo.content}*  ${timeToString(todo.due)}까지`).join('\n');

    if (cstodo.length < allCstodo.length)
        message += `\n이 밖에도 ${user.name}님의 할 일이 ${allCstodo.length - cstodo.length}개나 더 있어요... ${emoji('add')}`;

    await replyMessage(event, {
      username: `${user.name}님의 비서`,
      text: "",
      attachments: [{text: message, color: 'good'}],
      channel: event.channel,
      icon_emoji: emoji('default'),
    });
    return;
}

export default onTodoDefault;