import { ChatPostMessageArguments } from '@slack/web-api';
import { CommandInterface, webClient } from '.';

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
