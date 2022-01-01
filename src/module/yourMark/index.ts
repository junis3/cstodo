import { emoji, message } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import isAttack from '../isAttack';
import { MessageRouter } from '../router';
import { SlackReplyCommand } from '../../slack/replyMessage';

const onYourMark: MessageRouter = async ({ event }) => {
  const attack = isAttack(event);
  if (attack) return [attack];
  
  const text = event.text;
  
  if (text.slice(0, 12).toLowerCase() === 'on your mark') {
      return new SlackReplyCommand(event, {
          text: message('go', 'mark'),
          channel: event.channel,
          icon_emoji: emoji('go', 'mark'),
          username: 'Get Set...',
      });
  }

  if (text.slice(0, 12).toLowerCase() === 'on your marx') {
      return new SlackReplyCommand(event, {
          text: message('go', 'marx'),
          channel: event.channel,
          icon_emoji: emoji('go', 'marx'),
          username: 'Gyet Syet...',
      });
  }

  return [];
}

export default onYourMark;