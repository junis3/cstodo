import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replySuccess } from '../../etc/postMessage';
import timeToString from '../../etc/timeToString';
import { TodoRouter } from '../router';
import { TodoReplyCommand } from './reply';

const onTodoAll: TodoRouter = async ({ event, user }) => {
  const cstodo = await getCstodos(user.id);

  if (cstodo.length > 0) {
    const blocks = cstodo.map((todo, k) => (
      {
        type: 'section',
        fields: [{ type: 'mrkdwn', text: `*${k + 1}. ${todo.content}*` },
          { type: 'mrkdwn', text: `${timeToString(todo.due)}` }],
      }
    ));
    return new TodoReplyCommand(event, user, {
      text: '',
      attachments: [{
        blocks,
        color: 'good',
      }],
      channel: event.channel,
      icon_emoji: emoji('aww', user.theme),
      username: `${user.name}님의 비서`,
    });
  }
  await replySuccess(event, user, `${user.name}님의 진행중인 일이 없습니다!`, 'add');

  return [];
};

export default onTodoAll;
