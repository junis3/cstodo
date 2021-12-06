import { WebClient } from "@slack/web-api";
import { accessToken } from '../config';

export const webClient = new WebClient(accessToken);

export interface SlackCommand {
    exec(): Promise<void>;
}

export async function runCommands(commands: SlackCommand[]): Promise<void> {
    await Promise.all(commands.map((c) => c.exec()));
}
