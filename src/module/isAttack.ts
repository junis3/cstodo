import { emoji } from "../etc/cstodoMode";
import { replyMessage } from "../etc/postMessage";

const isAttack = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    const date = new Date(event.ts * 1000);

    return false;
  
    // Assert inappropriate characters in message
    if ( 
          (text.split('').filter((chr) => ['\n', '`', '\u202e', '\u202d'].find((x) => x === chr)).length > 0)
       || (text.length > 500) 
    ) {
      await replyMessage(event, {
        text: emoji('fuck'),
        channel: event.channel,
        icon_emoji: emoji('fuck'),
      });
      return true;
    }


    return false;

}

export default isAttack;