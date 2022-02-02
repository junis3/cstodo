import { getUser } from '../../database/user';
import {
  CstodoType, editCstodo, getCstodos,
} from '../../database/cstodo';
import { getArg } from '../../etc/parseQuery';
import stringToTime from '../../etc/stringToTime';
import timeToString from '../../etc/timeToString';
import preprocessContent from '../../etc/preprocessContent';
import { TodoRouter } from '../../router';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';

const isInteger = (s: string) => s.split('').every(
  (c) => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].find((x) => x === c) !== undefined,
);

const onTodoEdit: TodoRouter = async ({ event, user, query: { command, args } }) => {
  const todo = await getCstodos(user.id);

  const dueArg = getArg(['--due', '-d', '--time', '-t'], args);

  let newDue: number | undefined;
  if (!dueArg) {
    newDue = undefined;
  } else if (typeof dueArg === 'string') {
    const time = stringToTime(dueArg);
    if (!time) {
      return new ReplyFailureCommand(event, user, '제가 너무 바보같아서 말씀하신 시간을 잘 이해를 못했어요... 죄송합니다...');
    }
    newDue = time;
  } else {
    return new ReplyFailureCommand(event, user, `저는 똑떨이에요...\n${dueArg.message}`);
  }

  const contentArg = getArg(['--content', '-c'], args);

  let newContent: string | undefined;

  if (!contentArg) {
    newContent = undefined;
  } else if (typeof contentArg === 'string') {
    newContent = preprocessContent(contentArg);
  } else {
    return new ReplyFailureCommand(event, user, `저는 똑떨이에요...\n${contentArg.message}`);
  }

  const userArg = getArg(['--dangerous-user'], args);

  let newUser = user;

  if (typeof userArg === 'string') {
    if (newDue || newContent) {
      return new ReplyFailureCommand(event, user, '저는 똑떨이에요...');
    }
    newUser = await getUser(userArg) || newUser;
  }

  const change: Partial<CstodoType> = { due: newDue, content: newContent, owner: newUser.id };

  if (!newDue) delete change.due;
  if (!newContent) delete change.content;

  const changes: string[] = [];

  if (newDue) changes.push(`마감 시한을 ${timeToString(newDue)}까지로`);
  if (newContent) changes.push(`내용을 *${newContent}* 로`);
  if (newUser.id !== user.id) changes.push(`주인을 ${newUser.command}로`);

  const changeString = changes.join(', ');

  if (changeString.length === 0) {
    return new ReplyFailureCommand(event, user, '바꿀 게 없어서 똑떨이에요...');
  }

  if (command.length === 1) {
    return new ReplyFailureCommand(event, user, 'edit 쿼리에 인자가 없으면 똑떨이에요...');
  }

  let content = command.slice(1).join(' ').trim();

  if (!isInteger(content)) {
    return new ReplyFailureCommand(event, user, '할 일을 수정할 때엔 수정할 일의 번호를 주셔야 해요...');
  }
  const x = Number.parseInt(content, 10);

  if (x <= 0 || x > todo.length) {
    return new ReplyFailureCommand(event, user, `할 일이 ${todo.length}개인데 여기서 ${x}번째 할일을 바꾸면 똑떨이에요...`);
  }

  content = todo[x - 1].content;

  if (await editCstodo(content, change)) {
    return new ReplySuccessCommand(event, user, `${user.name}님의 할 일에서 *${content}* 의 ${changeString} 바꾸었어요!`, { iconEmoji: 'edit', muted: false });
  }
  return new ReplyFailureCommand(event, user, `${user.name}님의 할 일에서 *${content}* 을 바꾸는 데 실패했어요...`);
};

export default onTodoEdit;
