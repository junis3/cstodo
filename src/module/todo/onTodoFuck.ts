import { emoji } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import { webClient } from '../../index';
import { UserType } from '../../database/user';
import { QueryType } from '../../etc/parseQuery';

  
const onTodoFuck = async ({ command, args }: QueryType, event: any, user: UserType) => {
    await replyMessage(event, user, {
      text: emoji('fuck', user.theme).repeat(23),
      channel: event.channel,
      icon_emoji: emoji('fuck', user.theme),
    });

    await replyMessage(event, user, {
      text: '나감 ㅅㄱ',
      channel: event.channel,
      icon_emoji: emoji('fuck', user.theme),
    });

    try {
      await webClient.conversations.leave({
        channel: event.channel,
      });
    } catch (e) {
      console.log(e);
      if (typeof e === 'string' && e.endsWith('method_not_supported_for_channel_type')) return;
      else throw e;
    }
}

export default onTodoFuck;