import { emoji } from '../../etc/theme';
import { ForceMuteType, replyMessage } from '../../etc/postMessage';
import { setMuted, UserType } from '../../database/user';
import { QueryType } from '../../etc/parseQuery';
import { SlackMessageEvent } from '../../slack/event';
import { TodoRouter } from '../router';
import { TodoReplyCommand } from './reply';

  
const onTodoMute: TodoRouter = async ({ event, user }) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    
    if (tokens[1] === 'mute') {
        await setMuted(user.command, true);
        return new TodoReplyCommand(event, user, {
            text: `이제 ${user.command} 봇이 응답을 조용히 전달합니다.`,
            username: `${user.name}님의 조용한 비서`,
            channel: event.channel,
            icon_emoji: emoji('default', user.theme),
        }, {
            forceMute: 'unmute',
        });
    } else {
        await setMuted(user.command, false);
        return new TodoReplyCommand(event, user, {
            text: `이제 ${user.command} 봇이 응답을 시끄럽게 보냅니다.`,
            username: `${user.name}님의 시끄러운 비서`,
            channel: event.channel,
            icon_emoji: emoji('default', user.theme),
        }, {
            forceMute: 'unmute',
        });
    }
}

export default onTodoMute;