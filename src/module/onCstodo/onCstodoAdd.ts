import { addCstodo, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

const onCstodoAdd = async (event: any) => {
  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  
    let cstodo = await getCstodos();

    let query = tokens.slice(2).join(' ').trim();

    if(query === '') {
      await webClient.chat.postMessage({
        text: `add를 하면서 추가할 일을 안 주면 똑떨이에요... ${emoji('ddokddul')}`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul'),
        username: "똑떨한 cstodo",
      });
      return;
    } 

    await Promise.all(query.split(',').map(async (nowQuery) => {
      nowQuery = nowQuery.trim();
      
      if (cstodo.find((item) => item.content === nowQuery)) {
        await webClient.chat.postMessage({
          text: `이미 할 일에 있는 ${nowQuery}를 다시 추가하면 똑떨이에요... ${emoji('ddokddul')}`,
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: "똑떨한 cstodo",
        });
        return;
      } else {
        await addCstodo({ content: nowQuery });
        await webClient.chat.postMessage({
          text: `cs님의 할 일에 '${nowQuery}'를 추가했어요!`,
          icon_emoji: emoji('add'),
          channel: event.channel,
        });
      }
    }));
}

export default onCstodoAdd;