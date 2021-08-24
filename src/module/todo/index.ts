import onTodoDefault from './onTodoDefault';
import onTodoAdd from './onTodoAdd';
import onTodoHelp from './onTodoHelp';
import onTodoAll from './onTodoAll';
import onTodoLength from './onTodoLength';
import onTodoRemove from './onTodoRemove';
import onTodoSearch from './onTodoSearch';
import isAttack from '../isAttack';
import { UserType } from '../../database/user';

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
  if (!isQualified(event, user)) {
      return;
  }
  if (await isAttack(event)) return;

  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(event.ts * 1000);

  if (tokens[1] === 'help') {
    await onTodoHelp(event, user);
    return true;
  }

  if (tokens[1] === 'length' || tokens[1] === 'size') {
    await onTodoLength(event, user);
    return;
  }

  if (tokens[1] === 'search') {
    await onTodoSearch(event, user);
    return;
  }

  if (tokens[1] === 'all') {
    await onTodoAll(event, user);
    return;
  }
  
  if (tokens[1] === 'add' || tokens[1] === 'push' || tokens[1] === 'append') 
    await onTodoAdd(event, user);

  if (tokens[1] === 'remove' || tokens[1] === 'delete') 
    await onTodoRemove(event, user);

//  while (await onCstodoOverflow(event));

  await onTodoDefault(event, user);
}

export default onTodo;