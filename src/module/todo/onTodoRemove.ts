import { UserType } from '../../database/user';
import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import { Query } from 'mongoose';

const onCstodoRemove = async (event: any, user: UserType) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const query = tokens.slice(2).join(' ').trim();
    const todo = await getCstodos(user.id);
    
    if (query === '') {
      await replyMessage(event, {
        text: "빈 remove 쿼리는 똑떨이에요... " + emoji('ddokddul'),
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    const isInteger = (s: string) => {
      for (let c of s.split('')) {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].find((x) => x === c) === undefined) return false;
      }
      return true;
    }

    for (let s of query.split(',')) {
      const nowQuery = s.trim();

      let content: string;

      if (!isInteger(nowQuery)) {
        if (!todo.find((item) => item.content === nowQuery)) {
          await replyMessage(event, {
            text: `할 일에 없는 *${nowQuery}* 를 빼면 똑떨이에요... ` + emoji('ddokddul'),
            channel: event.channel,
            icon_emoji: emoji('ddokddul'),
            username: "똑떨한 cstodo",
          });
          return;
        }
        content = nowQuery;
      } else {
        let x = Number.parseInt(nowQuery);

        if (x <= 0 || x > todo.length) {
          await replyMessage(event, {
            text: `할 일이 ${todo.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요... ` + emoji('ddokddul'),
            channel: event.channel,
            icon_emoji: emoji('ddokddul'),
            username: '똑떨한 cstodo'
          });
          return;
        }
        content = todo[x-1].content;
      }

      await removeCstodo({ owner: user.id, content });
      await replyMessage(event, {
        text: `${user.name}님의 할 일에서 *${content}* 를 제거했어요!`,
        icon_emoji: emoji('remove'),
        channel: event.channel,
      }, {
        forceUnmute: true,
      });
    }
}

export default onCstodoRemove;