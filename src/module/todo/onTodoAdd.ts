import { UserType } from '../../database/user';
import { addCstodo, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';

const onCstodoAdd = async (event: any, user: UserType) => {
  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  
    let cstodo = await getCstodos(user.id);

    let preprocessQuery = (text: string) => {
      return text.trim().split('').filter((chr) => ['\n', '`', '\u202e', '\u202d', '*'].find((x) => x === chr) === undefined).join('');
    }

    let isQueryValid = (text: string) => {
      return text.length > 0 && text.length <= 100;
    }

    let query = tokens.slice(2).join(' ').trim().split(',').map(preprocessQuery);

    query = Array.from(new Set<string>(query));

    if (query.length === 0 || query.length > 25 || !query.every(isQueryValid)) {
      await replyMessage(event, {
        text: `이상한 쿼리를 주시면 저는 똑떨이에요... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: `${user.name}님의 똑떨한 비서`,
      });
      return;
    } 

    await Promise.all(query.map(async (nowQuery) => {
      nowQuery = preprocessQuery(nowQuery);
      
      if (cstodo.find((item) => item.content === nowQuery)) {
        await replyMessage(event, {
          username: `${user.name}님의 똑떨한 비서`,
          text: `이미 할 일에 있는 *${nowQuery}* 를 다시 추가하면 똑떨이에요... ${emoji('ddokddul')}`,
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
        });
        return;
      } else {
        await addCstodo({
          content: nowQuery,
          owner: user.id,
        });
        await replyMessage(event, {
          username: `${user.name}님의 비서`,
          text: `${user.name}님의 할 일에 *${nowQuery}* 를 추가했어요!`,
          icon_emoji: emoji('add'),
          channel: event.channel,
        }, {
          forceUnmute: true,
        });
      }
    }));
}

export default onCstodoAdd;