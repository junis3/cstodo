import { emoji } from '../etc/theme';
import { SlackMessageEvent } from '../command/event';
import { ReplyMessageCommand } from '../command/ReplyMessageCommand';

function isAttack(event: SlackMessageEvent): ReplyMessageCommand | undefined {
  const { text } = event;

  if (text.length > 10000) {
    return new ReplyMessageCommand(event, {
      text: emoji('fuck'),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
  }

  return undefined;
}

export default isAttack;
