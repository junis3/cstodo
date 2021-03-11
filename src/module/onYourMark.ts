import { cstodoMode, setCstodoMode, emoji, message } from '../etc/cstodoMode';
import { webClient } from '../index';

const onYourMark = async (event: any) => {
    const text : string = event.text;
    if(text.slice(0, 12).toLowerCase() === 'on your mark'){
        webClient.chat.postMessage({
            text: message('go', 'mark'),
            channel: event.channel,
            icon_emoji: emoji('go', 'mark'),
            username: 'Get Set...',
        });
        return;
    }
    if(text.slice(0, 12).toLowerCase() === 'on your marx'){
        webClient.chat.postMessage({
            text: message('go', 'marx'),
            channel: event.channel,
            icon_emoji: emoji('go', 'marx'),
            username: 'Gyet Syet...',
        });
        return;
    }
}

export default onYourMark;