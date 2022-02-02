import { Block, KnownBlock } from '@slack/web-api';
import { SerialCommand } from './SerialCommand';
import { UserType } from '../database/user';
import { emoji } from '../etc/theme';
import { AddReactionCommand } from './AddReactionCommand';
import { SlackMessageEvent } from './event';
import { PostMessageCommand } from './PostMessageCommand';
import { PostEphemeralCommand } from './PostEphemeralCommand';

interface ReplySuccessOptions {
  iconEmoji?: string;
  muted?: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export class ReplySuccessCommand extends SerialCommand {
  constructor(
    event: SlackMessageEvent,
    user: UserType,
    message: string | (Block | KnownBlock)[],
    options?: ReplySuccessOptions,
  ) {
    const muted = options?.muted ?? user.muted;
    const emojiKeyword = options?.iconEmoji ?? 'default';

    const postOption = {
      text: '',
      username: `${user.name}님의 비서`,
      attachments: [{
        text: typeof message === 'string' ? message : undefined,
        blocks: typeof message !== 'string' ? message : undefined,
        color: 'good',
      }],
      channel: event.channel,
      icon_emoji: emoji(emojiKeyword, user.theme),
    };

    if (muted) {
      super(
        new PostEphemeralCommand({
          ...postOption,
          user: event.user,
        }),
        new AddReactionCommand({
          name: 'blobokhand',
          timestamp: event.ts,
          channel: event.channel,
        }),
      );
    } else {
      super(
        new PostMessageCommand(postOption),
      );
    }
  }
}
