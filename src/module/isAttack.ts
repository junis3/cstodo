import { emoji } from "../etc/theme";
import { replyMessage } from "../etc/postMessage";
import { SlackMessageEvent } from "../slack/event";

const isAttack = async (event: SlackMessageEvent) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    const date = new Date(Number(event.ts) * 1000);

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