import { cstodoMode, emoji, setCstodoMode } from '../../etc/cstodoMode';
import { replyMessage, setMute } from '../../etc/postMessage';

  
const onCstodoMute = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    
    
    if (tokens[1] === 'mute') {
        await replyMessage(event, {
            text: `이제 cstodo가 응답을 조용히 전달합니다.`,
            channel: event.channel,
            icon_emoji: emoji('default'),
        });
        setMute(true);
    } else {
        setMute(false);
        await replyMessage(event, {
            text: `이제 cstodo가 응답을 공개적으로 보냅니다.`,
            channel: event.channel,
            icon_emoji: emoji('default'),
        });
    }
}

export default onCstodoMute;