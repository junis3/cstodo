
import { ChatPostMessageArguments } from '@slack/web-api';
import { webClient } from '..';
import { emoji } from './theme';
import { cstodoChannel, cstodoTestChannel } from '../config';
import { UserType } from '../database/user';


export const postMessage = async (props: ChatPostMessageArguments) => {    
    await webClient.chat.postMessage(props);
}
interface Options {
    forceUnmute?: boolean;
    forceMute?: boolean;
};

export const replyDdokddul = async (event: any, user: UserType, message: string, options?: Options) => {
    await replyMessage(event, user, {
        text: "",
        username: `${user.name}님의 똑떨한 비서`,
        attachments: [{
          text: `${message} ${emoji('ddokddul', user.theme)}`,
          color: "warning",
        }],
        channel: event.channel,
        icon_emoji: emoji('ddokddul', user.theme),
    }, options);
}

export const replySuccess = async (event: any, user: UserType, message: string, icon_emoji?: string, options?: Options) => {
    let emoji_kw = 'default';
    if (icon_emoji !== undefined) {
        emoji_kw = icon_emoji;
    }
    await replyMessage(event, user, {
        text: "",
        username: `${user.name}님의 비서`,
        attachments: [{
            text: message,
            color: "good",
        }],
        channel: event.channel,
        icon_emoji: emoji(emoji_kw, user.theme),
    }, options);
}

export const replyFail = async (event: any, user: UserType, message: string, options?: Options) => {
    await replyMessage(event, user, {
        text: "",
        username: `${user.name}님의 똑떨한 비서`,
        attachments: [{
          text: `${message} ${emoji('ddokddul', user.theme)}`,
          color: "danger",
        }],
        channel: event.channel,
        icon_emoji: emoji('ddokddul', user.theme),
    }, options);

    await replyMessage(event, user, {
        text: message,
        username: 'cstodo_troubleshoot',
        channel: cstodoTestChannel,
    });
}

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
