/* eslint-disable no-underscore-dangle */
import { ChatPostMessageArguments } from '@slack/web-api';
import { SlackCommand, webClient } from './command';
import { SlackMessageEvent } from './event';
import { addEmoji } from '../etc/postMessage';

export interface SlackReplyOptions {
  muted?: boolean;
}

export class SlackReplyCommand implements SlackCommand {
  private _props: ChatPostMessageArguments;

  private _muted: boolean;

  private _user: string;

  private _channel: string;

  private _ts: string;

  public get props(): ChatPostMessageArguments {
    return this._props;
  }

  public get muted(): boolean {
    return this._muted;
  }

  public get user(): string {
    return this._user;
  }

  public get channel(): string {
    return this._channel;
  }

  public get ts(): string {
    return this._ts;
  }

  constructor(
    event: SlackMessageEvent,
    props: ChatPostMessageArguments,
    options?: SlackReplyOptions,
  ) {
    this._props = props;
    this._muted = options?.muted ?? false;

    this._user = event.user;
    this._channel = event.channel;
    this._ts = event.ts;
  }

  public async exec(): Promise<void> {
    if (this.muted) {
      await webClient.chat.postEphemeral({
        ...this.props,
        user: this.user,
      });

      await addEmoji(this.ts, this.channel, 'blobokhand');
    } else await webClient.chat.postMessage(this.props);
  }
}
