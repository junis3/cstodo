import { emoji } from '../../etc/cstodoMode';
import onCstodoDefault from './onCstodoDefault';
import onCstodoAdd from './onCstodoAdd';
import onCstodoAll from './onCstodoAll';
import onCstodoFuck from './onCstodoFuck';
import onCstodoMute from './onCstodoMute';
import onCstodoHelp from './onCstodoHelp';
import onCstodoLength from './onCstodoLength';
import onCstodoMode from './onCstodoMode';
import onCstodoRemove from './onCstodoRemove';
import onCstodoSearch from './onCstodoSearch';
import onCstodoOverflow from './onCstodoOverflow';
import { replyMessage } from '../../etc/postMessage';

const onCstodo = async (event: any) => {
  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(event.ts * 1000);

  // Assert inappropriate characters in message
  if (text.split('').filter((chr) => ['\n', '`', '\u202e', '\u202d'].find((x) => x === chr)).length > 0 || text.length > 500) {
    await replyMessage(event, {
      text: emoji('fuck'),
      channel: event.channel,
      icon_emoji: emoji('fuck'),
    });
    return;
  }


  if (tokens[1] === 'help') {
    await onCstodoHelp(event);
    return;
  }

  if (tokens[1] === 'blob' || tokens[1] === 'weeb') {
    await onCstodoMode(event);
    return;
  }

  if (tokens[1] === 'mute' || tokens[1] === 'unmute') {
    await onCstodoMute(event);
    return;
  }

  if (tokens[1] === 'fuck' || tokens[1] === 'fu') {
    await onCstodoFuck(event);
    return;
  }

  if (tokens[1] === 'length' || tokens[1] === 'size') {
    await onCstodoLength(event);
    return;
  }

  if (tokens[1] === 'search') {
    await onCstodoSearch(event);
    return;
  }

  if (tokens[1] === 'all') {
    await onCstodoAll(event);
    return;
  }
  
  if (tokens[1] === 'add' || tokens[1] === 'push' || tokens[1] === 'append') 
    await onCstodoAdd(event);

  if (tokens[1] === 'remove' || tokens[1] === 'delete') 
    await onCstodoRemove(event);

//  while (await onCstodoOverflow(event));

  await onCstodoDefault(event);
}

export default onCstodo;