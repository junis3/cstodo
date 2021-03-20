
import { ChatPostMessageArguments } from '@slack/web-api';
import { webClient } from '..';


export const postMessage = async (props: ChatPostMessageArguments) => {    
    await webClient.chat.postMessage(props);
}


export const replyMessage = async (event: any, props: ChatPostMessageArguments) => {    
    await webClient.chat.postMessage({
        ...props,
        thread_ts: event.ts,
        reply_broadcast: true,
    });
}
