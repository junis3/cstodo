import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import { webClient } from '../../index';

  
const onCstodoFuck = async (event: any) => {
    await replyMessage(event, {
      text: emoji('fuck').repeat(23),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });

    await replyMessage(event, {
      text: '나감 ㅅㄱ',
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });

    try {
      await webClient.conversations.leave({
        channel: event.channel,
      });
    } catch (e) {
      if (typeof e === 'string' && e.endsWith('method_not_supported_for_channel_type')) return;
      console.log(typeof e);
      throw e;
    }
}

export default onCstodoFuck;