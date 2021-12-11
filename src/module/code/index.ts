import { replyMessage } from '../../etc/postMessage';
import { SlackMessageEvent } from '../../slack/event';
import isAttack from '../isAttack';

const onCode = async (event: SlackMessageEvent) => {
    const attack = isAttack(event);
    if (attack) {
        await attack.exec();
        return;
    }
    
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());

    let message = tokens.slice(1).join(' ');
    let left = message.indexOf('<');
    let right1 = message.slice(left).indexOf('|');
    let right2 = message.slice(left).indexOf('>');
    let right = right1 == -1 ? right2 : Math.min(right1, right2);
    if (right != -1) {
        await replyMessage(event, undefined, {
            text: message.slice(left+1, left+right),
            channel: event.channel,
        });
    }
}

export default onCode;