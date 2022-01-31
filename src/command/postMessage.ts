/* eslint-disable no-underscore-dangle */
import { ChatPostMessageArguments } from '@slack/web-api';
import { Command, webClient } from '.';

// eslint-disable-next-line import/prefer-default-export
export class SlackPostMessageCommand implements Command {
  private _props: ChatPostMessageArguments;

  public get props() {
    return this._props;
  }

  constructor(props: ChatPostMessageArguments) {
    this._props = props;
  }

  public async exec(): Promise<void> {
    await webClient.chat.postMessage(this.props);
  }
}
