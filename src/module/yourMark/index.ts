import { emoji, message } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import isAttack from '../isAttack';

const onYourMark = async (event: any) => {
  if (await isAttack(event)) return;
  
  const text : string = event.text;
  
  if(text.slice(0, 12).toLowerCase() === 'on your mark'){
      await replyMessage(event, undefined, {
          text: message('go', 'mark'),
          channel: event.channel,
          icon_emoji: emoji('go', 'mark'),
          username: 'Get Set...',
      });
      return;
  }
  if(text.slice(0, 12).toLowerCase() === 'on your marx'){
      await replyMessage(event, undefined, {
          text: message('go', 'marx'),
          channel: event.channel,
          icon_emoji: emoji('go', 'marx'),
          username: 'Gyet Syet...',
      });
      return;
  }
}

export default onYourMark;