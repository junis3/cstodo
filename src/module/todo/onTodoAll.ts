

import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyMessage, replySuccess } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';
import { QueryType } from '../../etc/parseQuery';
import { SlackMessageEvent } from '../../slack/event';
import { TodoRouter } from '../router';
import { SlackReplyMessageCommand } from '../../slack/replyMessage';

const onTodoAll: TodoRouter = async ({ event, user }) => {
    const cstodo = await getCstodos(user.id);

    if (cstodo.length > 0) {
        let blocks = cstodo.map((todo, k) => (
            {"type" : "section", "fields": [{"type": "mrkdwn", "text": `*${k+1}. ${todo.content}*`},
                                            {"type": "mrkdwn", "text": `${timeToString(todo.due)}`}]
            }
        ));
        return new SlackReplyMessageCommand(event, user, {
            text: "",
            attachments: [{
                blocks: blocks,
                color: "good",
            }],
            channel: event.channel,
            icon_emoji: emoji('aww', user.theme),
            username: `${user.name}님의 비서`,
        });
    } else {
        await replySuccess(event, user, `${user.name}님의 진행중인 일이 없습니다!`, 'add');
    }
    return [];
}

export default onTodoAll;