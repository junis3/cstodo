import { emoji } from "../etc/theme";
import { replyMessage } from "../etc/postMessage";

const isAttack = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    const date = new Date(event.ts * 1000);

    // Assert inappropriate characters in message
    if (text.length > 10000) {
      await replyMessage(event, undefined, {
        text: emoji('fuck'),
        channel: event.channel,
        icon_emoji: emoji('fuck'),
      });
      return true;
    }


    return false;

}

export default isAttack;