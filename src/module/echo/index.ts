import { replyMessage } from '../../etc/postMessage';
import isAttack from '../isAttack';

const onEcho = async (event: any) => {
    if (await isAttack(event)) return;
    
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());


    await replyMessage(event, {
        text: `${tokens.slice(1).join(' ')}`,
        channel: event.channel,
    });
}

export default onEcho;