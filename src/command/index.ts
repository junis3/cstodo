import { WebClient } from '@slack/web-api';
import { accessToken } from '../config';

export const webClient = new WebClient(accessToken);

export enum CommandSignal {
  Abort,
}

export interface CommandInterface {
  exec(): Promise<null | CommandSignal>;
}

export type ArrayPile<T> = T | ArrayPile<T>[];

export function depile<T>(pile: ArrayPile<T>): T[] {
  if (Array.isArray(pile)) return pile.map(depile).flat();
  return [pile];
}

export async function runCommands(
  commands: ArrayPile<CommandInterface>,
): Promise<null | CommandSignal> {
  // eslint-disable-next-line no-restricted-syntax
  for (const command of depile(commands)) {
    // eslint-disable-next-line no-await-in-loop
    const result = await command.exec();

    if (result === CommandSignal.Abort) break;
  }
  return null;
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
