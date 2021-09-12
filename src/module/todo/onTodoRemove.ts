import { UserType } from '../../database/user';
import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import { Query } from 'mongoose';
import { QueryType } from '../../etc/parseQuery';
import preprocessContent from '../../etc/preprocessContent';

const isInteger = (s: string) => {
  for (let c of s.split('')) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].find((x) => x === c) === undefined) return false;
  }
  return true;
}

const onTodoRemove = async ({ command }: QueryType, event: any, user: UserType) => {
    const todo = await getCstodos(user.id);
    
    if (command.length === 1) {
      await replyMessage(event, user, {
        text: "",
        attachments: [{
          text: "remove 쿼리에 인자를 주지 않으면 똑떨이에요... " + emoji('ddokddul', user.theme),
          color: "warning",
        }],
        channel: event.channel,
        icon_emoji: emoji('ddokddul', user.theme),
        username: `${user.name}님의 똑떨한 비서`,
      });
      return;
    } 


    let contents = new Set<string>();

    for (let s of command.slice(1).join(' ').split(',')) {
      let content = preprocessContent(s);

      if (!isInteger(content)) {
        if (!todo.find((item) => item.content === content)) {
          await replyMessage(event, user, {
            username: `${user.name}님의 똑떨한 비서`,
            text: "",
            attachments: [{
              text: `할 일에 없는 *${content}* 를 빼면 똑떨이에요... ` + emoji('ddokddul'),
              color: 'warning',
            }],
            channel: event.channel,
            icon_emoji: emoji('ddokddul', user.theme),
          });
          return;
        }
      } else {
        let x = Number.parseInt(content);

        if (x <= 0 || x > todo.length) {
          await replyMessage(event, user, {
            username: `${user.name}님의 똑떨한 비서`,
            text: "",
            attachments: [{
              text: `할 일이 ${todo.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요... ` + emoji('ddokddul'),
              color: "warning",
            }],
            channel: event.channel,
            icon_emoji: emoji('ddokddul', user.theme),
          });
          return;
        }
        
        content = todo[x-1].content;
      }
      contents.add(content);
    }

    for(let content of Array.from(contents)) {
      if (await removeCstodo({ owner: user.id, content })) {
        await replyMessage(event, user, {
          username: `${user.name}님의 비서`,
          text: "",
          attachments: [{
            text: `${user.name}님의 할 일에서 *${content}* 를 제거했어요!`,
            color: 'good',
          }],
          icon_emoji: emoji('remove', user.theme),
          channel: event.channel,
        }, {
          forceUnmute: (user.userControl === 'blacklist'),
        });
      } else {
        await replyMessage(event, user, {
          username: `${user.name}님의 똑떨한 비서`,
          text: "",
          attachments: [{
            text: `${user.name}님의 할 일에서 *${content}* 를 제거하는 데 실패했어요...`,
            color: 'danger',
          }],
          icon_emoji: emoji('ddokddul', user.theme),
          channel: event.channel,
        })
      }
    }
}

export default onTodoRemove;