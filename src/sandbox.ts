import { webClient } from ".";
import { emoji } from "./etc/cstodoMode";

// You can post message as a bot in the code
// Type <@usercode> or <@channelcode> to mention a person or channel

const csGod = 'UV78YL6TW';
const cstodoTestChannel = 'C01JER4T7AN';
const cstodoChannel = 'C01H4RY69CL';

const postMessage = async () => await webClient.chat.postMessage({
    text: ``,
    icon_emoji: emoji('communism'),
    channel: cstodoTestChannel,
    username: 'cstodo',
});

postMessage();