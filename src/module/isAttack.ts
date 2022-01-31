import { emoji } from '../etc/theme';
import { SlackMessageEvent } from '../command/event';
import { SlackReplyCommand } from '../command/replyMessage';

function isAttack(event: SlackMessageEvent): SlackReplyCommand | undefined {
  const { text } = event;

  if (text.length > 10000) {
    return new SlackReplyCommand(event, {
      text: emoji('fuck'),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
  }

  return undefined;
}

export default isAttack;
