import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';

const onCstodoPop = async (event: any) => {
    const cstodo = await getCstodos();

    if (cstodo.length === 1) {
        await replyMessage(event, {
          text: `할 일이 없는데 제거하면 똑떨이에요... ${emoji('ddokddul')}`,
          channel: event.channel,
          icon_emoji: emoji('ddokddul'),
          username: '똑떨한 cstodo',
        });
        return;
      }
  
      let nowQuery = cstodo[cstodo.length-1].content;
      
      await removeCstodo(nowQuery);
  
      await replyMessage(event, {
        text: `cs님의 할 일에서 '${nowQuery}'를 제거했어요!`,
        icon_emoji: emoji('remove'),
        channel: event.channel,
      });  
}

export default onCstodoPop;