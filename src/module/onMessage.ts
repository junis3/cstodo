import { csGod, cstodoTestChannel, isTesting } from '../config';
import onCstodo from './onCstodo/';
import onYourMark from './onYourMark';
import { webClient } from '../index';
import { emoji } from '../etc/cstodoMode';

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

    if (tokens[0] === 'echo') {
      await webClient.chat.postMessage({
        text: `\`${tokens.slice(1).join(' ')}\``,
        channel: event.channel,
      });
    }
    else if (tokens[0] === 'cstodo') onCstodo(event);
    else if (tokens[0].toLowerCase() === 'on') onYourMark(event);
    else if (Math.random() < 0.0025 + (event.user === csGod ? 0.005 : 0)) {
        let profileResult = await webClient.users.profile.get({
          user: lastUser || event.user,
        });

        

        if (!profileResult.ok) return;

        let profile : any = profileResult.profile;

        await webClient.chat.postMessage({
          text: `역시 <@${event.user}>님이에요... ${emoji('aww')}`,
          channel: event.channel,
          icon_url: profile.image_512,
          username: profile.display_name || profile.full_name,
        });
    }
}

export default onMessage;