import onTodoAdd from './onTodoAdd';
import onTodoHelp from './onTodoHelp';
import onTodoEdit from './onTodoEdit';
import onTodoAll from './onTodoAll';
import onTodoRemove from './onTodoRemove';
// import onTodoSearch from './onTodoSearch';
import onTodoSet from './onTodoSet';
import onTodoTheme from './onTodoTheme';
import onTodoMute from './onTodoMute';
import onTodoHW from './onTodoHW';
import parseQuery from '../../etc/parseQuery';
import isAttack from '../isAttack';
import { isThemeType, UserType } from '../../database/user';
import { SlackMessageEvent } from '../../command/event';
import { MessageRouter } from '../../router';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';
import { SerialCommand } from '../../command/SerialCommand';

const isQualified = (event: SlackMessageEvent, user: UserType) => {
  const isUserQualified = (() => {
    if (user.userControl === 'whitelist') {
      if (!user.userWhitelist) return false;
      // FIXME : give authority to users
      if (admins.find((x) => x === event.user)) return true;
      return user.userWhitelist.find((user) => user === event.user) !== undefined;
    }
    if (!user.userBlacklist) return true;
    return user.userBlacklist.find((user) => user === event.user) === undefined;
  })();

  const isChannelQualified = (() => {
    if (user.channelControl === 'whitelist') {
      if (!user.channelWhitelist) return false;
      return user.channelWhitelist.find((channel) => channel === event.channel) !== undefined;
    }
    if (!user.channelBlacklist) return true;
    return user.channelBlacklist.find((channel) => channel === event.channel) === undefined;
  })();

  return isUserQualified && isChannelQualified;
};

const onTodo: MessageRouter<{ user: UserType }> = async ({ event, user }) => {
  const attack = isAttack(event);
  if (attack) return attack;

  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());
  const query = parseQuery(tokens.slice(1).join(' '));

  if (!isQualified(event, user)) {
    return new ReplyFailureCommand(event, user);
  }

  if (query.command[0].length === 0) {
    return onTodoAll({ event, user, query });
  }

  if (query.command[0] === 'mute' || query.command[0] === 'unmute') {
    return onTodoMute({ query, event, user });
  }

  if (isThemeType(query.command[0])) {
    return onTodoTheme({ query, event, user });
  }

  if (query.command[0] === 'help') {
    return onTodoHelp({ query, event, user });
  }

  if (query.command[0] === 'all') {
    return onTodoAll({ query, event, user });
  }

  if (query.command[0] === 'set') {
    return onTodoSet({ query, event, user });
  }

  if (['hw', 'homework', 'h'].find((x) => x === query.command[0])) {
    return onTodoHW({ query, event, user });
  }

  // CRUD operations

  if (['edit', 'update', 'u'].find((x) => x === query.command[0])) {
    return new SerialCommand(
      await onTodoEdit({ query, event, user }),
      await onTodoAll({ query, event, user }),
    );
  }

  if (['add', 'push', 'append', 'a'].find((x) => x === query.command[0])) {
    return new SerialCommand(
      await onTodoAdd({ query, event, user }),
      await onTodoAll({ query, event, user }),
    );
  }

  if (['remove', 'delete', 'erase', 'rm', 'r'].find((x) => x === query.command[0])) {
    return new SerialCommand(
      await onTodoRemove({ query, event, user }),
      await onTodoAll({ query, event, user }),
    );
  }

  return new ReplyFailureCommand(event, user);
};

export default onTodo;
