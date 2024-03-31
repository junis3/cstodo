import isAttack from '../isAttack';
import { MessageRouter } from '../../router';
import { PostMessageCommand } from '../../command/PostMessageCommand';
import { bambooChannel } from '../../config';

const onBamboo: MessageRouter = async ({ event }) => {
  const attack = isAttack(event);
  if (attack) return attack;

  return new PostMessageCommand({
    text: event.text.split(' ').slice(1).join(),
    channel: bambooChannel,
  });
};

export default onBamboo;
