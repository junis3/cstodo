import { emoji } from '../etc/theme';
import { SlackMessageEvent } from '../slack/event';
import { SlackReplyCommand } from '../slack/replyMessage';

function isAttack(event: SlackMessageEvent): SlackReplyCommand | undefined {
  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(Number(event.ts) * 1000);

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
