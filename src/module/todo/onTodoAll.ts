import { getCstodos } from '../../database/cstodo';
import timeToString from '../../etc/timeToString';
import { TodoRouter } from '../../router';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';

const onTodoAll: TodoRouter = async ({ event, user }) => {
  const cstodo = await getCstodos(user.id);

  if (cstodo.length > 0) {
    const blocks = cstodo.map((todo, k) => ({
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*${k + 1}. ${todo.content}*` },
        { type: 'mrkdwn', text: `${timeToString(todo.due)}` },
      ],
    }));
    return new ReplySuccessCommand(event, user, blocks, { iconEmoji: 'aww' });
  }
  return new ReplySuccessCommand(
    event,
    user,
    `${user.name}님의 진행중인 일이 없습니다!`,
    { iconEmoji: 'add' }
  );
};

export default onTodoAll;
