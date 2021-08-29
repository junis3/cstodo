
import { ChatPostMessageArguments } from '@slack/web-api';
import { webClient } from '..';
import { cstodoChannel } from '../config';
import { UserType } from '../database/user';


export const postMessage = async (props: ChatPostMessageArguments) => {    
    await webClient.chat.postMessage(props);
}
interface Options {
    forceUnmute?: boolean;
    forceMute?: boolean;
};

export const replyMessage = async (event: any, user: UserType | undefined, props: ChatPostMessageArguments, options?: Options) => {   
    let allProps = props;

    let muted = user && user.muted;

    if (options && options.forceMute) muted = true;
    if (options && options.forceUnmute) muted = false;

    if (muted) allProps = {
        ...allProps,
        thread_ts: event.ts,
    };
    
    await webClient.chat.postMessage(allProps);
}
