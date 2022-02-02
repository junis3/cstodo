import { ChatPostEphemeralArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class PostEphemeralCommand implements CommandInterface {
  private props: ChatPostEphemeralArguments;

  constructor(props: ChatPostEphemeralArguments) {
    this.props = props;
  }

  public async exec() {
    await webClient.chat.postEphemeral(this.props);
    return null;
  }
}
