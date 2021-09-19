import onTodoDefault from './onTodoDefault';
import onTodoAdd from './onTodoAdd';
import onTodoHelp from './onTodoHelp';
import onTodoEdit from './onTodoEdit';
import onTodoAll from './onTodoAll';
import onTodoLength from './onTodoLength';
import onTodoRemove from './onTodoRemove';
import onTodoSearch from './onTodoSearch';
import onTodoTheme from './onTodoTheme';
import onTodoMute from './onTodoMute';
import onTodoFuck from './onTodoFuck';
import parseQuery from '../../etc/parseQuery';
import isAttack from '../isAttack';
import { isThemeType, UserType } from '../../database/user';

const isQualified = (event: any, user: UserType) => {
    const isUserQualified = (() => {
        if (user.userControl === 'whitelist') {
            if (!user.userWhitelist) return false;
            else return user.userWhitelist.find((user) => user === event.user) !== undefined;
        } else {
            if (!user.userBlacklist) return true;
            else return user.userBlacklist.find((user) => user === event.user) === undefined;
        }
    })();

    const isChannelQualified = (() => {
        if (user.channelControl === 'whitelist') {
            if (!user.channelWhitelist) return false;
            else return user.channelWhitelist.find((channel) => channel === event.channel) !== undefined;
        } else {
            if (!user.channelBlacklist) return true;
            else return user.channelBlacklist.find((channel) => channel === event.channel) === undefined;
        }
    })();

    return isUserQualified && isChannelQualified;
}

const onTodo = async (event: any, user: UserType) => {
  if (!isQualified(event, user)) return;
  if (await isAttack(event)) return;

  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const query = parseQuery(tokens.slice(1).join(' '));

  if (query.command[0] === 'fuck') {
    await onTodoFuck(query, event, user);
    return;
  }

  if (query.command[0] === 'mute' || query.command[0] === 'unmute') {
    await onTodoMute(query, event, user);
    return;
  }

  if (isThemeType(query.command[0])) {
    await onTodoTheme(query, event, user);
    return;
  }

  if (query.command[0] === 'help') {
    await onTodoHelp(query, event, user);
    return;
  }

  if (query.command[0] === 'length' || query.command[0] === 'size') {
    await onTodoLength(query, event, user);
    return;
  }

  if (query.command[0] === 'search') {
    await onTodoSearch(query, event, user);
    return;
  }

  if (query.command[0] === 'all') {
    await onTodoAll(query, event, user);
    return;
  }

  if (query.command[0] === 'edit' || query.command[0] === 'update')
    await onTodoEdit(query, event, user);
  
  if (query.command[0] === 'add' || query.command[0] === 'push' || query.command[0] === 'append') 
    await onTodoAdd(query, event, user);

  if (query.command[0] === 'remove' || query.command[0] === 'delete' || query.command[0] === 'erase') 
    await onTodoRemove(query, event, user);

//  while (await onCstodoOverflow(event));

  await onTodoAll(query, event, user);
}

export default onTodo;