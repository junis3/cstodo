import { SerialCommand } from './SerialCommand';
import { AbortCommand } from './AbortCommand';
import { AddReactionCommand } from './AddReactionCommand';
import { PostEphemeralCommand } from './PostEphemeralCommand';
import { SlackMessageEvent } from './event';
import { UserType } from '../database/user';
import { emoji } from '../etc/theme';

export class ReplyFailureCommand extends SerialCommand {
  constructor(event: SlackMessageEvent, user?: UserType, message?: string) {
    const addReactionCommand = new AddReactionCommand({
      name: 'sad',
      timestamp: event.ts,
      channel: event.channel,
      command: event.command,
    });

    const abortCommand = new AbortCommand();

    if (!message || !user) {
      super(addReactionCommand, abortCommand);
      return;
    }

    const postEphemeralCommand = new PostEphemeralCommand({
      channel: event.channel,
      user: event.user,
      text: '',
      username: `${user.name}님의 똑떨한 비서`,
      attachments: [
        {
          text: `${message} ${emoji('ddokddul', user.theme)}`,
          color: 'danger',
        },
      ],
    });

    super(addReactionCommand, postEphemeralCommand, abortCommand);
  }
}
