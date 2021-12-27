import { csGod, cstodoChannel, cstodoTestChannel, isTesting } from '../config';
// import onEcho from './echo';
import onCode from './code';
import onTodo from './todo';
import onBar from './bar';
import onYourMark from './yourMark';
import { getUser } from '../database/user';
import { webClient } from '../slack/command';
import { emoji } from '../etc/theme';
import { replyMessage } from '../etc/postMessage';
import { addMessage } from '../database/message';
import { SlackMessageEvent } from '../slack/event';
import { runCommands } from '../slack/command';
import { MessageRouter } from './router';
import { SlackReplyMessageCommand } from '../slack/replyMessage';

const turnOnTimestamp = new Date().getTime() / 1000;

let lastUser: string;
let nowUser: string;

const onMessage: MessageRouter = async ({ event }) => {
    if (Number(event.ts) < turnOnTimestamp) return [];
//    if (isTesting && event.channel !== cstodoTestChannel) return;
    if (!event.text || !event.user) return [];
    if (event.thread_ts) return [];

    if (nowUser != event.user) {
      lastUser = nowUser;
      nowUser = event.user;
    }

    const text : string = event.text.replace(/[^ -~가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
    const tokens = text.split(' ').filter((str) => str.length > 0);

    if (tokens.length < 1) return [];

    const command = tokens[0].toLowerCase();

    // Special commands
    if (event.channel === cstodoTestChannel && command === 'restart' && (event.user === 'UV6HYQD3J' || event.user === 'UV8DYMMV5')) {
      process.exit();
    }
    // if (command === 'echo' && tokens.length > 1) {
    //   if (tokens.length < 5 || !([0, 1, 2, 3, 4].every((i) => tokens[i].toLowerCase() === 'echo'))) {
    //     await runCommands(onEcho(event));
    //   }
    // }
    else if (command === 'code' && tokens.length > 1) return onCode({ event });
    else if (command === 'on') return onYourMark({ event });

    // Todo commands
    let user = await getUser(command);

    if (user) {
      if (user.taskType === "todo") return onTodo({ event, user });
      else if (user.taskType === "bar") await onBar(event, user);
    }

    // Random blobaww
    let percentage = 0.00050;
    if (event.channel === cstodoChannel) percentage *= 2.5;
    if (event.user === csGod) percentage *= 2.5;

    const blobawwFired = Math.random() < percentage;

    addMessage({ event, blobawwFired });

    if (blobawwFired) {
      let profileResult = await webClient.users.profile.get({
        user: csGod,
      });

      if (!profileResult.ok) return [];

      let profile: any = profileResult.profile;

      return new SlackReplyMessageCommand(event, user, {
        text: `역시 <@${event.user}>님이에요... ${emoji('aww')}`,
        channel: event.channel,
        icon_url: profile.image_512,
        username: profile.display_name || profile.full_name,
      });
    }

    return [];
}

export default onMessage;
