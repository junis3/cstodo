import { addCstodo } from '../../database/cstodo';
import { getArg } from '../../etc/parseQuery';
import stringToTime from '../../etc/stringToTime';
import preprocessContent from '../../etc/preprocessContent';
import { TodoRouter } from '../../router';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';

const isSlackDecoration = (text: string) => {
  const match = text.match(/[~_]+/);
  return match !== null && text === match[0];
};

const MAX_LENGTH = 200;

const validateContent = (text: string) => {
  if (text.length === 0) return '쿼리를 넣어주세요!';
  if (text.length > MAX_LENGTH) return `쿼리가 ${MAX_LENGTH}글자를 넘어서 똑떨이에요..`;
  if (isSlackDecoration(text)) return '개같은 쿼리를 넣으면 똑떨이에요..';
  return null;
};

const onTodoAdd: TodoRouter = async ({ event, user, query: { command, args } }) => {
  //  const todo = await getCstodos(user.id);

  const dueArg = getArg(['--due', '-d', '--time', '-t'], args);

  let due = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1,
    6,
  ).getTime();

  if (typeof dueArg === 'string') {
    const time = stringToTime(dueArg);
    if (!time) {
      return new ReplyFailureCommand(
        event,
        user,
        '제가 너무 바보같아서 말씀하신 시간을 잘 이해를 못했어요... 죄송합니다...',
      );
    }
    due = time;
  } else if (dueArg) {
    return new ReplyFailureCommand(
      event,
      user,
      `이런 이유로 저는 똑떨이에요...\n${dueArg.message}`,
    );
  }

  const content = preprocessContent(command.slice(1).join(' ').trim());

  const validateError = validateContent(content);
  if (validateError !== null) {
    return new ReplyFailureCommand(event, user, validateError);
  }

  //  if (todo.find((item) => item.content === content)) {
  //    return new ReplyFailureCommand(event, user, `이미 할 일에 있는 *${content}* 를 다시 추가하면 똑떨이에요...`);
  //  }

  await addCstodo({
    content,
    owner: user.id,
    due,
    createdBy: event.user,
  });

  return new ReplySuccessCommand(
    event,
    user,
    `${user.name}님의 할 일에 *${content}* 를 추가했어요!`,
    { iconEmoji: 'add' },
  );
};

export default onTodoAdd;
