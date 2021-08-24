import { csGod, cstodoChannel, cstodoTestChannel, isTesting } from '../config';
import onEcho from './echo';
import onCode from './code';
import onCstodo from './cstodo';
import onTodo from './todo';
import onYourMark from './yourMark';
import { getUser } from '../database/user';
import { webClient } from '../index';
import { emoji } from '../etc/cstodoMode';
import { replyMessage } from '../etc/postMessage';

const turnOnTimestamp = new Date().getTime() / 1000;

let lastUser: string;
let nowUser: string;

const onMessage = async (event: any) => {
    if (event.ts < turnOnTimestamp) return;
//    if (isTesting && event.channel !== cstodoTestChannel) return;
    if (!event.text || !event.user) return;

    if (nowUser != event.user) {
      lastUser = nowUser;
      nowUser = event.user;
    }


    const text : string = event.text;
    const tokens = text.split(' ');

    if (tokens.length < 1) return;

    const command = tokens[0].toLowerCase();

    // Special commands
    if (command === 'echo' && tokens.length > 1) await onEcho(event);
    else if (command === 'code' && tokens.length > 1) await onCode(event);
    else if (command === 'cstodo') {
      if (await onCstodo(event)) return;
    } else if (command === 'on') await onYourMark(event);

    // Todo commands
    let user = await getUser(command);

    if (user) await onTodo(event, user);

    // Random blobaww
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