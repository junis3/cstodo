import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

  
const onCstodoFuck = async (event: any) => {
    await webClient.chat.postMessage({
      text: emoji('fuck').repeat(23),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });

    await webClient.chat.postMessage({
      text: '나감 ㅅㄱ',
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });

    await webClient.conversations.leave({
      channel: event.channel,
    });
}

export default onCstodoFuck;