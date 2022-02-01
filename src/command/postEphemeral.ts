import { ChatPostEphemeralArguments } from '@slack/web-api';
import { Command, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class PostEphemeralCommand implements Command {
  private props: ChatPostEphemeralArguments;

  constructor(props: ChatPostEphemeralArguments) {
    this.props = props;
  }

  public async exec(): Promise<void> {
    await webClient.chat.postEphemeral(this.props);
  }
}
