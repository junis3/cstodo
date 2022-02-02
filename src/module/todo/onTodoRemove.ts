import { getCstodos, removeCstodo } from '../../database/cstodo';
import preprocessContent from '../../etc/preprocessContent';
import { isInteger } from '../../etc/isInteger';
import { TodoRouter } from '../router';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';

const onTodoRemove: TodoRouter = async ({ user, event, query: { command } }) => {
  const todo = await getCstodos(user.id);

  if (command.length === 1) {
    return new ReplyFailureCommand(event, user, 'remove 쿼리에 인자가 없으면 똑떨이에요...');
  }

  const contents = new Set<string>();

  // eslint-disable-next-line no-restricted-syntax
  for (const s of command.slice(1).join(' ').split(',')) {
    let content = preprocessContent(s);

    // eslint-disable-next-line no-continue
    if (!content) continue;

    if (!isInteger(content)) {
      return new ReplyFailureCommand(event, user, '할 일을 제거할 땐 제거할 일의 번호를 주셔야 해요...');
    }
    const x = Number.parseInt(content, 10);

    if (x <= 0 || x > todo.length) {
      return new ReplyFailureCommand(event, user, `할 일이 ${todo.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요...`);
    }

    content = todo[x - 1].content;

    contents.add(content);
  }

  // eslint-disable-next-line no-restricted-syntax

  return Promise.all(Array.from(contents).map(async (content) => {
    if (await removeCstodo({ owner: user.id, content })) {
      return new ReplySuccessCommand(event, user, `${user.name}님의 할 일에서 *${content}* 를 제거했어요!`, {
        muted: false,
        iconEmoji: 'remove',
      });
    }
    return new ReplyFailureCommand(event, user, `${user.name}님의 할 일에서 *${content}* 를 제거하는 데 실패했어요...`);
  }));
};

export default onTodoRemove;
