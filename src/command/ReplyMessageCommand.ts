import { ChatPostMessageArguments } from '@slack/web-api';
import { SerialCommand } from './SerialCommand';
import { SlackMessageEvent } from './event';
import { PostMessageCommand } from './PostMessageCommand';
import { AddReactionCommand } from './AddReactionCommand';
import { PostEphemeralCommand } from './PostEphemeralCommand';

export interface ReplyMessageOptions {
  muted?: boolean;
}

export class ReplyMessageCommand extends SerialCommand {
  constructor(
    event: SlackMessageEvent,
    args: ChatPostMessageArguments,
    options?: ReplyMessageOptions
  ) {
    const { channel, user, ts: timestamp } = event;

    const muted = options?.muted ?? false;

    if (muted) {
      super(
        new PostEphemeralCommand({ ...args, channel, user }),
        new AddReactionCommand({
          name: 'blobokhand',
          timestamp,
          channel,
          command: event.command,
        })
      );
    } else {
      super(new PostMessageCommand({ ...args, channel }));
    }
  }
}
