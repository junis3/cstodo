import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

const onCstodoRemove = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    const cstodo = await getCstodos();

    const query = tokens.slice(2).join(' ').trim();
    
    if (query === '') {
      webClient.chat.postMessage({
        text: "빈 remove 쿼리는 똑떨이에요... " + emoji('ddokddul'),
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();
      
      if (!cstodo.find((item) => item.content === nowQuery)) {
        await webClient.chat.postMessage({
          text: `할 일에 없는 '${nowQuery}'를 빼면 똑떨이에요... ` + emoji('ddokddul'),
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: "똑떨한 cstodo",
        });
      } else {
        await removeCstodo(nowQuery);
        await webClient.chat.postMessage({
          text: `cs님의 할 일에서 '${nowQuery}'를 제거했어요!`,
          icon_emoji: emoji('remove'),
          channel: event.channel,
        });
      }
    }));

}

export default onCstodoRemove;