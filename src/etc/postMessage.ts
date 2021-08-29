
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

    let muted = user && user.muted;

    if (options && options.forceMute) muted = true;
    if (options && options.forceUnmute) muted = false;

    if (muted) {
        await webClient.chat.postEphemeral({
            ...props,
            user: event.user,
        });

        try {
            await webClient.reactions.add({
                name: 'blobokhand',
                timestamp: event.ts,
                channel: event.channel,
            });
        } catch (e) {

        }
    }
    else await webClient.chat.postMessage(props);
}
