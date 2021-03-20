import { cstodoMode, setCstodoMode, emoji, message } from '../etc/cstodoMode';
import { replyMessage } from '../etc/postMessage';
import { webClient } from '../index';

const onYourMark = async (event: any) => {
    const text : string = event.text;
    if(text.slice(0, 12).toLowerCase() === 'on your mark'){
        await replyMessage(event, {
            text: message('go', 'mark'),
            channel: event.channel,
            icon_emoji: emoji('go', 'mark'),
            username: 'Get Set...',
        });
        return;
    }
    if(text.slice(0, 12).toLowerCase() === 'on your marx'){
        await replyMessage(event, {
            text: message('go', 'marx'),
            channel: event.channel,
            icon_emoji: emoji('go', 'marx'),
            username: 'Gyet Syet...',
        });
        return;
    }
}

export default onYourMark;