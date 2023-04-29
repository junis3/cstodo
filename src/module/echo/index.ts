import { ReplyMessageCommand } from '../../command/ReplyMessageCommand';
import isAttack from '../isAttack';
import { MessageRouter } from '../../router';

const onEcho: MessageRouter = ({ event }) => {
  const attack = isAttack(event);
  if (attack) return attack;
  // eslint-disable-next-line max-len
  //    if (event.thread_ts && Number.parseFloat(event.thread_ts) < (new Date().getTime() / 1000) - 5 * 60) return;

  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());

  const preprocessQuery = (text: string) =>
    text
      .trim()
      .split('')
      .filter(
        (chr) =>
          ['<', '>', '\u202e', '\u202d'].find((x) => x === chr) === undefined
      )
      .join('')
      .slice(0, 600);

  const query = preprocessQuery(tokens.slice(1).join(' '));

  return new ReplyMessageCommand(event, {
    text: query,
    channel: event.channel,
    thread_ts: event.thread_ts,
  });
};

export default onEcho;
