import parseQuery from '../../etc/parseQuery';
import isAttack from '../isAttack';
import { UserType } from '../../database/user';
import onBarDefault from './onBarDefault';
import onBarAdd from './onBarAdd';
import onBarEdit from './onBarEdit';
import onBarRemove from './onBarRemove';
import onBarHW from './onBarHW';
import { SlackMessageEvent } from '../../command/event';

const isQualified = (event: SlackMessageEvent, user: UserType) => {
  const isUserQualified = (() => {
    if (user.userControl === 'whitelist') {
      if (!user.userWhitelist) return false;
      return (
        user.userWhitelist.find((user) => user === event.user) !== undefined
      );
    }
    if (!user.userBlacklist) return true;
    return user.userBlacklist.find((user) => user === event.user) === undefined;
  })();

  const isChannelQualified = (() => {
    if (user.channelControl === 'whitelist') {
      if (!user.channelWhitelist) return false;
      return (
        user.channelWhitelist.find((channel) => channel === event.channel) !==
        undefined
      );
    }
    if (!user.channelBlacklist) return true;
    return (
      user.channelBlacklist.find((channel) => channel === event.channel) ===
      undefined
    );
  })();

  return isUserQualified && isChannelQualified;
};

const onBar = async (event: SlackMessageEvent, user: UserType) => {
  if (!isQualified(event, user)) return;
  const attack = isAttack(event);
  if (attack) {
    await attack.exec();
    return;
  }

  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());
  const query = parseQuery(tokens.slice(1).join(' '));

  if (query.command[0] === 'hw' || query.command[0] === 'homework') {
    await onBarHW(query, event, user);
    return;
  }

  if (query.command[0] === 'edit' || query.command[0] === 'update') {
    await onBarEdit(query, event, user);
  }

  if (
    query.command[0] === 'add' ||
    query.command[0] === 'push' ||
    query.command[0] === 'append'
  ) {
    await onBarAdd(query, event, user);
  }

  if (
    query.command[0] === 'remove' ||
    query.command[0] === 'delete' ||
    query.command[0] === 'erase'
  ) {
    await onBarRemove(query, event, user);
  }

  await onBarDefault(query, event, user);
};

export default onBar;
