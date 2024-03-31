import isAttack from '../isAttack';
import { MessageRouter } from '../../router';
import { PostMessageCommand } from '../../command/PostMessageCommand';
import { bambooChannel } from '../../config';

const onBamboo: MessageRouter = async ({ event }) => {
  const attack = isAttack(event);
  if (attack) return attack;

  return new PostMessageCommand({
    text: event.text,
    channel: bambooChannel,
  });
};

export default onBamboo;
