import { ChatPostMessageArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class PostMessageCommand implements CommandInterface {
  private props: ChatPostMessageArguments;

  constructor(props: ChatPostMessageArguments) {
    this.props = props;
  }

  public async exec() {
    await webClient.chat.postMessage(this.props);
    return null;
  }
}
