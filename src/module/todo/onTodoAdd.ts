import { UserType } from '../../database/user';
import { addCstodo, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import { getArg, QueryType } from '../../etc/parseQuery';
import stringToTime from '../../etc/stringToTime';

let preprocess = (text: string) => {
  return text.trim().split('').filter((chr) => ['\n', '`', '\u202e', '\u202d', '*'].find((x) => x === chr) === undefined).join('');
}

let isQueryValid = (text: string) => {
  return text.length > 0 && text.length <= 100;
}

function makeUnique<T>(arr: T[]) {
  return Array.from(new Set<T>(arr));
}

const onTodoAdd = async ({ command, args }: QueryType, event: any, user: UserType) => {
  let todo = await getCstodos(user.id);

  const dueArg = getArg(['--due', '-d', '--time', '-t'], args);

  let _due = 0;
  if (!dueArg) {
    _due = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 6).getTime();
  } else if (typeof dueArg === 'string') {
    const time = stringToTime(dueArg);
    if (!time) {
      await replyMessage(event, {
        text: `제가 너무 바보같아서 말씀하신 시간을 잘 이해를 못했어요... 죄송합니다... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: `${user.name}님의 똑떨한 비서`,
      });
      return;
    }
    _due = time;
  } else {
    await replyMessage(event, {
      text: `이런 이유로 저는 똑떨이에요... ${emoji('ddokddul')}\n${dueArg.message}`,
      channel: event.channel,
      icon_emoji: emoji('ddokddul'),
      username: `${user.name}님의 똑떨한 비서`,
    });
    return;
  }

  const due = _due;

  const contents = makeUnique(command.slice(1).join(' ').trim().split(',').map(preprocess));

  if (contents.length === 0 || contents.length > 25 || !contents.every(isQueryValid)) {
    await replyMessage(event, {
      text: `이상한 쿼리를 주시면 저는 똑떨이에요... ${emoji('ddokddul')}`,
      channel: event.channel,
      icon_emoji: emoji('ddokddul'),
      username: `${user.name}님의 똑떨한 비서`,
    });
    return;
  } 

  await Promise.all(contents.map(async (content) => {
    if (todo.find((item) => item.content === content)) {
      await replyMessage(event, {
        username: `${user.name}님의 똑떨한 비서`,
        text: `이미 할 일에 있는 *${content}* 를 다시 추가하면 똑떨이에요... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
      });
      return;
    } 
    else {
      await addCstodo({
        content,
        owner: user.id,
        due,
      });
      
      await replyMessage(event, {
        username: `${user.name}님의 비서`,
        text: `${user.name}님의 할 일에 *${content}* 를 추가했어요!`,
        icon_emoji: emoji('add'),
        channel: event.channel,
      }, {
        forceUnmute: true,
      });

    }
  }));
}

export default onTodoAdd;