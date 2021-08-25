import { replyMessage } from '../../etc/postMessage';
import isAttack from '../isAttack';

const onEcho = async (event: any) => {
    if (await isAttack(event)) return;
    
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());


    let preprocessQuery = (text: string) => {
        return text.trim().split('').filter((chr) => ['<', '>', '\u202e', '\u202d'].find((x) => x === chr) === undefined).join('').slice(0, 100);
    }  

    const query = preprocessQuery(tokens.slice(1).join(' '));

    await replyMessage(event, {
        text: query,
        channel: event.channel,
    });
}

export default onEcho;