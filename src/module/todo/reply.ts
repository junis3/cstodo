import { ChatPostMessageArguments } from '@slack/web-api';
import { UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { SlackMessageEvent } from '../../slack/event';
import { SlackReplyCommand } from '../../slack/replyMessage';

type ForceMuteType = 'mute' | 'unmute';

interface TodoReplyOptions {
    forceMute?: ForceMuteType;
}

export class TodoReplyCommand extends SlackReplyCommand {
  constructor(event: SlackMessageEvent, user: UserType, props: ChatPostMessageArguments, options?: TodoReplyOptions) {
    const isMuted = () => {
      if (options?.forceMute === 'mute') return true;
      if (options?.forceMute === 'unmute') return false;
      return user.muted;
    };
    super(event, props, { muted: isMuted() });
  }
}

interface SuccessfulTodoReplyOptions extends TodoReplyOptions {
    iconEmoji?: string;
}

export class SuccessfulTodoReplyCommand extends TodoReplyCommand {
  constructor(event: SlackMessageEvent, user: UserType, message: string, options?: SuccessfulTodoReplyOptions) {
    const emojiKeyword = options?.iconEmoji ?? 'default';

    super(event, user, {
      text: '',
      username: `${user.name}님의 비서`,
      attachments: [{
        text: message,
        color: 'good',
      }],
      channel: event.channel,
      icon_emoji: emoji(emojiKeyword, user.theme),
    }, options);
  }
}

type DdokddulTodoReplyOptions = TodoReplyOptions;

export class DdokddulTodoReplyCommand extends TodoReplyCommand {
  constructor(event: SlackMessageEvent, user: UserType, message: string, options?: DdokddulTodoReplyOptions) {
    super(event, user, {
      text: '',
      username: `${user.name}님의 똑떨한 비서`,
      attachments: [{
        text: `${message} ${emoji('ddokddul', user.theme)}`,
        color: 'danger',
      }],
      channel: event.channel,
      icon_emoji: emoji('ddokddul', user.theme),
    }, options);
  }
}
