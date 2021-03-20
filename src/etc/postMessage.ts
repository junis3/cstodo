
import { ChatPostMessageArguments } from '@slack/web-api';
import { webClient } from '..';
import { cstodoChannel } from '../config';


export const postMessage = async (props: ChatPostMessageArguments) => {    
    await webClient.chat.postMessage(props);
}

let isMuted = false;

export const setMute = (newMuted: boolean) => {
    isMuted = newMuted;
}

export const replyMessage = async (event: any, props: ChatPostMessageArguments) => {   
    let allProps = props;
    if (isMuted) allProps = {
        ...allProps,
        thread_ts: event.ts,
    };
    
    await webClient.chat.postMessage(allProps);
}
