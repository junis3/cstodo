import { ChatPostMessageArguments } from '@slack/web-api';
import { webClient } from '../slack/command';
import { emoji } from './theme';
import { cstodoChannel, cstodoTestChannel } from '../config';
import { UserType } from '../database/user';
import { SlackMessageEvent } from '../slack/event';

export const postMessage = async (props: ChatPostMessageArguments) => {
  await webClient.chat.postMessage(props);
};

export const addEmoji = async (ts: string, channel: string, emojiName: string) => {
  try {
    await webClient.reactions.add({
      name: emojiName,
      timestamp: ts,
      channel,
    });
  } catch (e) {

  }
};

export enum ForceMuteType {
    Unmute,
    Mute
}

export interface Options {
    forceMuteType?: ForceMuteType;
}

export const replyDdokddul = async (event: SlackMessageEvent, user: UserType, message: string, options?: Options) => {
  await replyMessage(event, user, {
    text: '',
    username: `${user.name}님의 똑떨한 비서`,
    attachments: [{
      text: `${message} ${emoji('ddokddul', user.theme)}`,
      color: 'warning',
    }],
    channel: event.channel,
    icon_emoji: emoji('ddokddul', user.theme),
  }, options);
};

export const replySuccess = async (event: SlackMessageEvent, user: UserType, message: string, icon_emoji?: string, options?: Options) => {
  let emoji_kw = 'default';
  if (icon_emoji !== undefined) {
    emoji_kw = icon_emoji;
  }
  await replyMessage(event, user, {
    text: '',
    username: `${user.name}님의 비서`,
    attachments: [{
      text: message,
      color: 'good',
    }],
    channel: event.channel,
    icon_emoji: emoji(emoji_kw, user.theme),
  }, options);
};

export const replyFail = async (event: SlackMessageEvent, user: UserType, message: string, options?: Options) => {
  await replyMessage(event, user, {
    text: '',
    username: `${user.name}님의 똑떨한 비서`,
    attachments: [{
      text: `${message} ${emoji('ddokddul', user.theme)}`,
      color: 'danger',
    }],
    channel: event.channel,
    icon_emoji: emoji('ddokddul', user.theme),
  }, options);

  await replyMessage(event, user, {
    text: message,
    username: 'cstodo_troubleshoot',
    channel: cstodoTestChannel,
  });
};

export const replyMessage = async (event: SlackMessageEvent, user: UserType | undefined, props: ChatPostMessageArguments, options?: Options) => {
  let muted = user?.muted;

  if (options?.forceMuteType === ForceMuteType.Mute) muted = true;
  else if (options?.forceMuteType === ForceMuteType.Unmute) muted = false;

  if (muted) {
    await webClient.chat.postEphemeral({
      ...props,
      user: event.user,
    });

    await addEmoji(event.ts, event.channel, 'blobokhand');
  } else await webClient.chat.postMessage(props);
};
