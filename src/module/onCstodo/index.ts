import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';
import { getCstodos, removeCstodo } from '../../database/cstodo';
import onCstodoAdd from './onCstodoAdd';
import onCstodoFormat from './onCstodoFormat';
import onCstodoFuck from './onCstodoFuck';
import onCstodoHelp from './onCstodoHelp';
import onCstodoLength from './onCstodoLength';
import onCstodoMode from './onCstodoMode';
import onCstodoPop from './onCstodoPop';
import onCstodoRemove from './onCstodoRemove';
import onCstodoSearch from './onCstodoSearch';
import onCstodoShuffle from './onCstodoShuffle';
import onCstodoOverflow from './onCstodoOverflow';

const onCstodo = async (event: any) => {
  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(event.ts * 1000);

  // Assert inappropriate characters in message
  if (text.split('').filter((chr) => ['\n', '`', '\u202e', '\u202d'].find((x) => x === chr)).length > 0 || text.length > 500) {
    webClient.chat.postMessage({
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

  if (tokens[1] === 'format') {
    await onCstodoFormat(event);
    return;
  }
  
  if (tokens[1] === 'shuffle') 
    await onCstodoShuffle(event);

  if (tokens[1] === 'add' || tokens[1] === 'push' || tokens[1] === 'append') 
    await onCstodoAdd(event);

  if (tokens[1] === 'remove' || tokens[1] === 'delete') 
    await onCstodoRemove(event);
  
  if (tokens.length === 2 && tokens[1] === 'pop') 
    await onCstodoPop(event);

  while (onCstodoOverflow(event));

  const cstodo = await getCstodos();
  
  let fmtText = `:god: ${emoji('cs')} 할 일 목록 :god: (Request time: ${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초)\n` + cstodo.map((todo) => todo.content).join(', ');

  await webClient.chat.postMessage({
    text: fmtText,
    channel: event.channel,
    icon_emoji: emoji('default'),
  });
}

export default onCstodo;