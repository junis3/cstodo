
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

interface Options {
    forceUnmute?: boolean;
    forceMute?: boolean;
};

export const replyMessage = async (event: any, props: ChatPostMessageArguments, options?: Options) => {   
    let allProps = props;
    if (isMuted && !(options && options.forceUnmute) || options?.forceMute) allProps = {
        ...allProps,
        thread_ts: event.ts,
    };
    
    await webClient.chat.postMessage(allProps);
}
