import { ChatPostMessageArguments } from '@slack/web-api';
import { JoinCommand } from '.';
import { SlackMessageEvent } from './event';
import { PostMessageCommand } from './postMessage';
import { AddReactionCommand } from './addReaction';
import { PostEphemeralCommand } from './postEphemeral';

export interface ReplyMessageOptions {
  muted?: boolean;
}

export class ReplyMessageCommand extends JoinCommand {
  constructor(
    event: SlackMessageEvent,
    args: ChatPostMessageArguments,
    options?: ReplyMessageOptions,
  ) {
    const { channel, user, ts: timestamp } = event;

    const muted = options?.muted ?? false;

    if (muted) {
      super(
        new PostEphemeralCommand({ ...args, channel, user }),
        new AddReactionCommand({ name: 'blobokhand', timestamp, channel }),
      );
    } else {
      super(
        new PostMessageCommand({ ...args, channel }),
      );
    }
  }
}
