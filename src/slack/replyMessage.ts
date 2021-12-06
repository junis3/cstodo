import { ChatPostMessageArguments } from "@slack/web-api";
import { SlackCommand, webClient } from "./command";
import { UserType } from "../database/user";
import { SlackMessageEvent } from "./event";
import { addEmoji, ForceMuteType, Options } from "../etc/postMessage";

export class SlackReplyMessageCommand implements SlackCommand {
    private _props: ChatPostMessageArguments;
    private _muted: boolean;
    private _user: string;
    private _channel: string;
    private _ts: string;
    private _options?: Options;

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

    public get options(): Options | undefined {
        return this._options;
    }

    constructor(event: SlackMessageEvent, user: UserType | undefined, props: ChatPostMessageArguments, options?: Options) {
        this._props = props;
        this._muted = !!user?.muted;

        if (options?.forceMuteType === ForceMuteType.Mute) this._muted = true;
        else if (options?.forceMuteType === ForceMuteType.Unmute) this._muted = false;

        this._user = event.user;
        this._channel = event.channel;
        this._ts = event.ts;

        this._options = options;
    }

    public async exec(): Promise<void> {
        if (this.muted) {
            await webClient.chat.postEphemeral({
                ...this.props,
                user: this.user,
            });

            await addEmoji(this.ts, this.channel, 'blobokhand');
        }

        else await webClient.chat.postMessage(this.props);
    }
}
