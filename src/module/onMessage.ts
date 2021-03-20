import { csGod, cstodoChannel, cstodoTestChannel, isTesting } from '../config';
import onCstodo from './onCstodo/';
import onYourMark from './onYourMark';
import { webClient } from '../index';
import { emoji } from '../etc/cstodoMode';
import { replyMessage } from '../etc/postMessage';

const turnOnTimestamp = new Date().getTime() / 1000;

let lastUser: string;
let nowUser: string;

const onMessage = async (event: any) => {
    if (event.ts < turnOnTimestamp) return;
    if (isTesting && event.channel !== cstodoTestChannel) return;
    if (!event.text || !event.user) return;

    if (nowUser != event.user) {
      lastUser = nowUser;
      nowUser = event.user;
    }


    const text : string = event.text;
    const tokens = text.split(' ');

    if (tokens.length < 1) return;
    else if (tokens[0] === 'echo' && tokens.length > 1) {
      await replyMessage(event, {
        text: `${tokens.slice(1).join(' ')}`,
        channel: event.channel,
      });
    }
    else if (tokens[0] === 'code' && tokens.length > 1) {
      let message = tokens.slice(1).join(' ');
      let left = message.indexOf('<');
      let right1 = message.slice(left).indexOf('|');
      let right2 = message.slice(left).indexOf('>');
      let right = right1 == -1 ? right2 : Math.min(right1, right2);
      if (right != -1) {
        await replyMessage(event, {
          text: message.slice(left+1, left+right),
          channel: event.channel,
        });
      }
    }
    else if (tokens[0] === 'cstodo') onCstodo(event);
    else if (tokens[0].toLowerCase() === 'on') onYourMark(event);
    
    let percentage = 0.0010;
    if (event.channel === cstodoChannel || event.channel === cstodoTestChannel) percentage *= 2.0;
    if (event.user === csGod) percentage *= 3.0;

    if (Math.random() < percentage) {
      let profileResult = await webClient.users.profile.get({
        user: csGod,
      });

      if (!profileResult.ok) return;

      let profile : any = profileResult.profile;

      await replyMessage(event, {
        text: `역시 <@${event.user}>님이에요... ${emoji('aww')}`,
        channel: event.channel,
        icon_url: profile.image_512,
        username: profile.display_name || profile.full_name,
      });
    }
}

export default onMessage;