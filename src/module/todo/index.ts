import onTodoAdd from './onTodoAdd';
import onTodoHelp from './onTodoHelp';
import onTodoEdit from './onTodoEdit';
import onTodoAll from './onTodoAll';
// import onTodoLength from './onTodoLength';
import onTodoRemove from './onTodoRemove';
import onTodoOverflow from './onTodoOverflow';
// import onTodoSearch from './onTodoSearch';
import onTodoSet from './onTodoSet';
import onTodoTheme from './onTodoTheme';
import onTodoMute from './onTodoMute';
import onTodoHW from './onTodoHW';
import parseQuery from '../../etc/parseQuery';
import isAttack from '../isAttack';
import { isThemeType, UserType } from '../../database/user';
import { addEmoji } from '../../etc/postMessage';
import { SlackMessageEvent } from '../../command/event';
import { MessageRouter } from '../router';

const isQualified = (event: SlackMessageEvent, user: UserType) => {
  const isUserQualified = (() => {
    if (user.userControl === 'whitelist') {
      if (!user.userWhitelist) return false;
      // FIXME : give authority to users
      if (event.user === 'UV8DYMMV5' || event.user === 'UV6HYQD3J') return true;
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
  if (attack) return [attack];

  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());
  const query = parseQuery(tokens.slice(1).join(' '));

  if (!isQualified(event, user)) {
    await addEmoji(event.ts, event.channel, 'sad');
    return [];
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

  // if (query.command[0] === 'length' || query.command[0] === 'size') {
  //   return onTodoLength({ query, event, user });
  // }

  // if (query.command[0] === 'search') {
  //   return onTodoSearch({ query, event, user });
  // }

  if (query.command[0] === 'all') {
    return onTodoAll({ query, event, user });
  }

  if (query.command[0] === 'set') {
    return onTodoSet({ query, event, user });
  }

  if (query.command[0] === 'hw' || query.command[0] === 'homework') {
    return onTodoHW({ query, event, user });
  }

  // CRUD operations

  if (query.command[0] === 'edit' || query.command[0] === 'update') {
    const x = await onTodoEdit({ query, event, user });
    const y = await onTodoAll({ query, event, user });
    while (await onTodoOverflow(query, event, user));
    return [x, y];
  }

  if (query.command[0] === 'add' || query.command[0] === 'push' || query.command[0] === 'append') {
    const x = await onTodoAdd({ query, event, user });
    const y = await onTodoAll({ query, event, user });
    while (await onTodoOverflow(query, event, user));
    return [x, y];
  }

  if (query.command[0] === 'remove' || query.command[0] === 'delete' || query.command[0] === 'erase') {
    const x = await onTodoRemove({ query, event, user });
    const y = await onTodoAll({ query, event, user });
    while (await onTodoOverflow(query, event, user));
    return [x, y];
  }

  await addEmoji(event.ts, event.channel, 'sad');
  return [];
};

export default onTodo;
