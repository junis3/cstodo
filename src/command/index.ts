import { WebClient } from '@slack/web-api';
import { accessToken } from '../config';

export const webClient = new WebClient(accessToken);

export enum CommandSignal {
  Abort,
}

export interface CommandInterface {
  exec(): Promise<null | CommandSignal>;
}

export class Command implements CommandInterface {
  promiseGenerator: () => Promise<null | CommandSignal>;

  constructor(promiseGenerator: () => Promise<null | CommandSignal>) {
    this.promiseGenerator = promiseGenerator;
  }

  async exec() {
    const result = await this.promiseGenerator();
    return result;
  }
}
