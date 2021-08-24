import onCstodoFuck from './onCstodoFuck';
import onCstodoMute from './onCstodoMute';
import onCstodoHelp from './onCstodoHelp';
import onCstodoMode from './onCstodoMode';
import isAttack from '../isAttack';

const onCstodo = async (event: any) => {
  if (await isAttack(event)) return;

  const text : string = event.text;
  const tokens = text.split(' ').map((token) => token.trim());
  const date = new Date(event.ts * 1000);

  if (tokens[1] === 'help') {
    await onCstodoHelp(event);
    return true;
  }

  if (tokens[1] === 'blob' || tokens[1] === 'weeb') {
    await onCstodoMode(event);
    return true;
  }

  if (tokens[1] === 'mute' || tokens[1] === 'unmute') {
    await onCstodoMute(event);
    return true;
  }

  if (tokens[1] === 'fuck' || tokens[1] === 'fu') {
    await onCstodoFuck(event);
    return true;
  }

  return false;
}

export default onCstodo;