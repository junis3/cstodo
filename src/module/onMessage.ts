import { csGod } from '../config';
import onCstodo from './onCstodo';
import onYourMark from './onYourMark';
import { webClient } from '../index';
import { emoji } from '../etc/cstodoMode';

const turnOnTimestamp = new Date().getTime() / 1000;

const onMessage = (event: any) => {
    if (event.ts < turnOnTimestamp) return;
    if (!event.text || !event.user) return;

    const text : string = event.text;
    const tokens = text.split(' ');

    if (tokens[0] === 'cstodo') onCstodo(event);
    else if (tokens[0].toLowerCase() === 'on') onYourMark(event);
    else if (Math.random() < 0.003 + (event.user === csGod ? 0.007 : 0)) {
        webClient.chat.postMessage({
          text: `역시 <@${event.user}>님이에요... ${emoji('aww')}`,
          channel: event.channel,
          icon_emoji: emoji('aww'),
        });
    }
}

export default onMessage;