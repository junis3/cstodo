import { ChatPostEphemeralArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

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
