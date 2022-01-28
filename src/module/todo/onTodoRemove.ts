import { getCstodos, removeCstodo } from '../../database/cstodo';
import {
  replySuccess, replyDdokddul, replyFail, ForceMuteType,
} from '../../etc/postMessage';
import preprocessContent from '../../etc/preprocessContent';
import { isInteger } from '../../etc/isInteger';
import { TodoRouter } from '../router';

const onTodoRemove: TodoRouter = async ({ user, event, query: { command } }) => {
  const todo = await getCstodos(user.id);

  if (command.length === 1) {
    await replyDdokddul(event, user, 'remove 쿼리에 인자가 없으면 똑떨이에요...');
    return [];
  }

  const contents = new Set<string>();

  // eslint-disable-next-line no-restricted-syntax
  for (const s of command.slice(1).join(' ').split(',')) {
    let content = preprocessContent(s);

    if (!content) continue;
    if (!isInteger(content)) {
      await replyDdokddul(event, user, '할 일을 제거할 땐 제거할 일의 번호를 주셔야 해요...');
      return [];
    }
    const x = Number.parseInt(content);

    if (x <= 0 || x > todo.length) {
      await replyDdokddul(event, user, `할 일이 ${todo.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요...`);
      return [];
    }

    content = todo[x - 1].content;

    contents.add(content);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const content of Array.from(contents)) {
    if (await removeCstodo({ owner: user.id, content })) {
      await replySuccess(event, user, `${user.name}님의 할 일에서 *${content}* 를 제거했어요!`, 'remove', {
        forceMuteType: user.userControl === 'blacklist' ? ForceMuteType.Unmute : undefined,
      });
    } else {
      await replyFail(event, user, `${user.name}님의 할 일에서 *${content}* 를 제거하는 데 실패했어요...`);
    }
  }
  return [];
};

export default onTodoRemove;
