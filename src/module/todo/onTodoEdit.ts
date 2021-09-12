import { UserType } from '../../database/user';
import { addCstodo, CstodoType, editCstodo, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import { getArg, QueryType } from '../../etc/parseQuery';
import stringToTime from '../../etc/stringToTime';
import timeToString from '../../etc/timeToString';
import preprocessContent from '../../etc/preprocessContent';

const isInteger = (s: string) => {
  for (let c of s.split('')) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].find((x) => x === c) === undefined) return false;
  }
  return true;
}

const onTodoEdit = async ({ command, args }: QueryType, event: any, user: UserType) => {
  let todo = await getCstodos(user.id);

  const dueArg = getArg(['--due', '-d', '--time', '-t'], args);

  let newDue: number | undefined;
  if (!dueArg) {
    newDue = undefined;
  } else if (typeof dueArg === 'string') {
    const time = stringToTime(dueArg);
    if (!time) {
      await replyMessage(event, {
        text: "",
        attachments: [{
        text: `제가 너무 바보같아서 말씀하신 시간을 잘 이해를 못했어요... 죄송합니다... ${emoji('ddokddul')}`,
        color: 'warning',
        }],
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: `${user.name}님의 똑떨한 비서`,
      });
      return;
    }
    newDue = time;
  } else {
    await replyMessage(event, {
      text: "",
      attachments: [{
      text: `이런 이유로 저는 똑떨이에요... ${emoji('ddokddul')}\n${dueArg.message}`,
      color: 'warning',
      }],
      channel: event.channel,
      icon_emoji: emoji('ddokddul'),
      username: `${user.name}님의 똑떨한 비서`,
    });
    return;
  }

  const contentArg = getArg(['--content', '-c'], args);

  let newContent : string | undefined;

  if (!contentArg) {
    newContent = undefined;
  } else if (typeof contentArg === 'string') {
    newContent = preprocessContent(contentArg);
  } else {
    await replyMessage(event, {
      text: "",
      attachments: [{
      text: `이런 이유로 저는 똑떨이에요... ${emoji('ddokddul')}\n${contentArg.message}`,
      color: 'warning',
      }],
      channel: event.channel,
      icon_emoji: emoji('ddokddul'),
      username: `${user.name}님의 똑떨한 비서`,
    });
    return;
  }

  const change: Partial<CstodoType> = { due: newDue, content: newContent };

  if (!newDue) delete change.due;
  if (!newContent) delete change.content;

  let changeString = '';

  if (newDue) changeString += `마감 시한을 ${timeToString(newDue)}까지로, `;
  if (newContent) changeString += `내용을 *${newContent}* 로, `;

  if (changeString.length === 0) {
    await replyMessage(event, {
      text: "",
      attachments: [{
      text: "바꿀 게 없어서 똑떨이에요... " + emoji('ddokddul'),
      color: "warning",
      }],
      channel: event.channel,
      icon_emoji: emoji('ddokddul'),
      username: `${user.name}님의 똑떨한 비서`,
    });
    return;
  }

  changeString = changeString.slice(0, changeString.length - 2);

  if (command.length === 1) {
    await replyMessage(event, {
      text: "",
      attachments: [{
      text: "edit 쿼리에 인자를 주지 않으면 똑떨이에요... " + emoji('ddokddul'),
      color: 'warning',
      }],
      channel: event.channel,
      icon_emoji: emoji('ddokddul'),
      username: `${user.name}님의 똑떨한 비서`,
    });
    return;
  } 


  let contents = new Set<string>();

  for (let s of command.slice(1).join(' ').split(',')) {
    let content = s.trim();

    if (!isInteger(content)) {
      if (!todo.find((item) => item.content === content)) {
        await replyMessage(event, {
          username: `${user.name}님의 똑떨한 비서`,
          text: "",
          attachments: [{
          text: `할 일에 없는 *${content}* 를 바꾸면 똑떨이에요... ` + emoji('ddokddul'),
          color: 'warning',
          }],
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
        });
        return;
      }
    } else {
      let x = Number.parseInt(content);

      if (x <= 0 || x > todo.length) {
        await replyMessage(event, {
          username: `${user.name}님의 똑떨한 비서`,
          text: '',
          attachments: [{
          text: `할 일이 ${todo.length}개인데 여기서 ${x}번째 할 일을 바꾸면 똑떨이에요... ` + emoji('ddokddul'),
          color: 'warning',
          }],
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
        });
        return;
      }
      
      content = todo[x-1].content;
    }
    contents.add(content);
  }

  for(let content of Array.from(contents)) {
    if (await editCstodo(content, change)) {
      await replyMessage(event, {
        username: `${user.name}님의 비서`,
        text: "",
        attachments: [{
        text: `${user.name}님의 할 일에서 *${content}* 의 ${changeString} 바꾸었어요!`,
        color: 'good',
        }],
        icon_emoji: emoji('remove'),
        channel: event.channel,
      }, {
        forceUnmute: true,
      });
    } else {
      await replyMessage(event, {
        username: `${user.name}님의 똑떨한 비서`,
        text: "",
        attachments: [{
        text: `${user.name}님의 할 일에서 *${content}* 을 바꾸는 데 실패했어요...`,
        color: 'danger',
        }],
        icon_emoji: emoji('ddokddul'),
        channel: event.channel,
      })
    }
  }
}

export default onTodoEdit;