import { getUser, UserType } from '../../database/user';
import { addCstodo, CstodoType, editCstodo, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { ForceMuteType, replyDdokddul, replyFail, replySuccess } from '../../etc/postMessage';
import { getArg, QueryType } from '../../etc/parseQuery';
import stringToTime from '../../etc/stringToTime';
import timeToString from '../../etc/timeToString';
import preprocessContent from '../../etc/preprocessContent';
import { SlackMessageEvent } from '../../slack/event';
import { TodoRouter } from '../router';

const isInteger = (s: string) => {
  for (let c of s.split('')) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].find((x) => x === c) === undefined) return false;
  }
  return true;
}

const onTodoEdit: TodoRouter = async ({ event, user, query: { command, args } }) => {
  let todo = await getCstodos(user.id);

  const dueArg = getArg(['--due', '-d', '--time', '-t'], args);

  let newDue: number | undefined;
  if (!dueArg) {
    newDue = undefined;
  } else if (typeof dueArg === 'string') {
    const time = stringToTime(dueArg);
    if (!time) {
      await replyDdokddul(event, user, `제가 너무 바보같아서 말씀하신 시간을 잘 이해를 못했어요... 죄송합니다...`);
      return [];
    }
    newDue = time;
  } else {
    await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요...\n${dueArg.message}`);
    return [];
  }

  const contentArg = getArg(['--content', '-c'], args);

  let newContent : string | undefined;

  if (!contentArg) {
    newContent = undefined;
  } else if (typeof contentArg === 'string') {
    newContent = preprocessContent(contentArg);
  } else {
    await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요...\n${contentArg.message}`)
    return [];
  }

  const userArg = getArg(['--dangerous-user'], args);

  let newUser = user;

  if (typeof userArg === 'string') {
    if (newDue || newContent) {
      await replyDdokddul(event, user, `저는 똑떨이에요...`)
      return [];
    } else {
      newUser = await getUser(userArg) || newUser;
    }
  }

  const change: Partial<CstodoType> = { due: newDue, content: newContent, owner: newUser.id };

  if (!newDue) delete change.due;
  if (!newContent) delete change.content;

  let changeString = '';

  if (newDue) changeString += `마감 시한을 ${timeToString(newDue)}까지로, `;
  if (newContent) changeString += `내용을 *${newContent}* 로, `;
  if (newUser.id !== user.id) changeString += `주인을 ${newUser.command}로, `

  if (changeString.length === 0) {
    await replyDdokddul(event, user, `바꿀 게 없어서 똑떨이에요...`);
    return [];
  }

  changeString = changeString.slice(0, changeString.length - 2);

  if (command.length === 1) {
    await replyDdokddul(event, user, `edit 쿼리에 인자가 없으면 똑떨이에요...`)
    return [];
  } 


  let contents = new Set<string>();

  for (let s of command.slice(1).join(' ').split(',')) {
    let content = s.trim();

    if (!isInteger(content)) {
      if (!todo.find((item) => item.content === content)) {
        await replyDdokddul(event, user, `할 일에 없는 *${content}* 를 바꾸면 똑떨이에요...`)
        return [];
      }
    } else {
      let x = Number.parseInt(content);

      if (x <= 0 || x > todo.length) {
        await replyDdokddul(event, user, `할 일이 ${todo.length}개인데 여기서 ${x}번째 할일을 바꾸면 똑떨이에요...`)
        return [];
      }
      
      content = todo[x-1].content;
    }
    contents.add(content);
  }

  for(let content of Array.from(contents)) {
    if (await editCstodo(content, change)) {
      await replySuccess(event, user, `${user.name}님의 할 일에서 *${content}* 의 ${changeString} 바꾸었어요!`, 'edit', { forceMuteType: ForceMuteType.Unmute });
    } else {
      await replyFail(event, user, `${user.name}님의 할 일에서 *${content}* 을 바꾸는 데 실패했어요...`);
    }
  }

  return [];
}

export default onTodoEdit;