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
    props: ChatPostMessageArguments,
    options?: ReplyMessageOptions,
  ) {
    const { channel, user, ts: timestamp } = event;
    const { text } = props;

    const muted = options?.muted ?? false;

    if (muted) {
      super(
        new PostEphemeralCommand({ channel, text, user }),
        new AddReactionCommand({ name: 'blobokhand', timestamp, channel }),
      );
    } else {
      super(
        new PostMessageCommand({ channel, text }),
      );
    }
  }
}
