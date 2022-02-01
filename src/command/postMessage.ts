import { ChatPostMessageArguments } from '@slack/web-api';
import { Command, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class PostMessageCommand implements Command {
  private props: ChatPostMessageArguments;

  constructor(props: ChatPostMessageArguments) {
    this.props = props;
  }

  public async exec(): Promise<void> {
    await webClient.chat.postMessage(this.props);
  }
}
