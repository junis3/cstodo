import { csGod } from '../config';
import onCstodo from './onCstodo';
import { webClient } from '../index';

const turnOnTimestamp = new Date().getTime() / 1000;

const onMessage = (event: any) => {
    if (event.ts < turnOnTimestamp) return;
    if (!event.text) return;

    const text : string = event.text;
    const tokens = text.split(' ');

    if (tokens[0] === 'cstodo') onCstodo(event);
    else if (Math.random() < 0.003 + (event.user === csGod ? 0.007 : 0)) {
        webClient.chat.postMessage({
          text: `역시 <@${event.user}>님이에요... :blobaww:`,
          channel: event.channel,
          icon_emoji: ':blobaww:'
        });
    }
}

export default onMessage;