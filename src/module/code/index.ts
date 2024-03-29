import { ReplyMessageCommand } from '../../command/ReplyMessageCommand';
import isAttack from '../isAttack';
import { MessageRouter } from '../../router';
import { PassCommand } from '../../command/PassCommand';

const onCode: MessageRouter = async ({ event }) => {
  const attack = isAttack(event);
  if (attack) return attack;

  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());

  const message = tokens.slice(1).join(' ');
  const left = message.indexOf('<');
  const right1 = message.slice(left).indexOf('|');
  const right2 = message.slice(left).indexOf('>');
  const right = right1 === -1 ? right2 : Math.min(right1, right2);
  if (right !== -1) {
    return new ReplyMessageCommand(event, {
      text: message.slice(left + 1, left + right),
      channel: event.channel,
    });
  }

  return new PassCommand();
};

export default onCode;
