import { JoinCommand } from '.';
import { AddReactionCommand } from './addReaction';
import { PostEphemeralCommand } from './postEphemeral';
import { SlackMessageEvent } from './event';
import { UserType } from '../database/user';
import { emoji } from '../etc/theme';

// eslint-disable-next-line import/prefer-default-export
export class ReplyFailureCommand extends JoinCommand {
  constructor(event: SlackMessageEvent, user?: UserType, message?: string) {
    const addReactionCommand = new AddReactionCommand({
      name: ':sad:',
      timestamp: event.ts,
      channel: event.channel,
    });

    if (!message || !user) {
      super(addReactionCommand);
      return;
    }

    const postEphemeralCommand = new PostEphemeralCommand({
      channel: event.channel,
      user: event.user,
      text: '',
      username: `${user.name}님의 똑떨한 비서`,
      attachments: [{
        text: `${message} ${emoji('ddokddul', user.theme)}`,
        color: 'danger',
      }],
    });

    super(
      addReactionCommand,
      postEphemeralCommand,
    );
  }
}
