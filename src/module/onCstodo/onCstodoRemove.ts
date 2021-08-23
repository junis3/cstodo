import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';

const onCstodoRemove = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const cstodo = await getCstodos();

    const query = tokens.slice(2).join(' ').trim();
    
    if (query === '') {
      await replyMessage(event, {
        text: "빈 remove 쿼리는 똑떨이에요... " + emoji('ddokddul'),
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();

      let x: number | undefined;
      try {
        x = Number.parseInt(nowQuery);
      } catch {
        x = undefined;
      }

      let content: string;

      if (x === undefined) {
        if (!cstodo.find((item) => item.content === nowQuery)) {
          await replyMessage(event, {
            text: `할 일에 없는 '${nowQuery}'를 빼면 똑떨이에요... ` + emoji('ddokddul'),
            channel: event.channel,
            icon_emoji: emoji('ddokddul'),
            username: "똑떨한 cstodo",
          });
          return;
        }
        content = nowQuery;
      } else {
        if (x <= 0 || x > cstodo.length) {
          await replyMessage(event, {
            text: `할 일이 ${cstodo.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요... ` + emoji('ddokddul'),
            channel: event.channel,
            icon_emoji: emoji('ddokddul'),
            username: '똑떨한 cstodo'
          });
          return;
        }
        content = cstodo[x-1].content;
      }

      await removeCstodo(content);
      await replyMessage(event, {
        text: `cs님의 할 일에서 *${content}* 를 제거했어요!`,
        icon_emoji: emoji('remove'),
        channel: event.channel,
      }, {
        forceUnmute: true,
      });
    }));

}

export default onCstodoRemove;