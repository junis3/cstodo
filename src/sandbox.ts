import { webClient } from ".";
import { getHistories } from "./database/history";
import { emoji } from "./etc/cstodoMode";

// You can post message as a bot in the code
// Type <@usercode> or <@channelcode> to mention a person or channel

const csGod = 'UV78YL6TW';
const cstodoTestChannel = 'C01JER4T7AN';
const cstodoChannel = 'C01H4RY69CL';

const postMessage = async (text: string) => await webClient.chat.postMessage({
    text,
//    icon_url: 'https://ca.slack-edge.com/TURU8C6P3-UV0NU58SD-7842b2be1e23-512',
    icon_emoji: ':cs71107:', // emoji('angry')
    channel: cstodoTestChannel,
    username: 'cs71107',
});

// postMessage('씨갤러들 안뇽 ㅋ');
