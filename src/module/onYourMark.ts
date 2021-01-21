import { IconEmojiMap, MessageMap, cstodoMode, setCstodoMode } from '../etc/cstodoMode';
import { webClient } from '../index';

const onYourMark = async (event: any) => {
    const text : string = event.text;
    if(text.toLowerCase() === 'on your mark...'){
        webClient.chat.postMessage({
            text: MessageMap.go['mark'],
            channel: event.channel,
            icon_emoji: IconEmojiMap.go['mark'],
            username: 'Get Set...',
        });
        return;
    }
    if(text.toLowerCase() === 'on your marx...'){
        webClient.chat.postMessage({
            text: MessageMap.go['marx'],
            channel: event.channel,
            icon_emoji: IconEmojiMap.go['marx'],
            username: 'Gyet Syet...',
        });
        return;
    }
}

export default onYourMark;