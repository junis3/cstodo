import { ChatPostMessageArguments } from "@slack/web-api";
import { SlackCommand, webClient } from "./command";

export class SlackPostMessageCommand implements SlackCommand {
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
