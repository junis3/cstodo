import { WebClient } from '@slack/web-api';
import { accessToken } from '../config';

export const webClient = new WebClient(accessToken);

export interface Command {
  exec(): Promise<void>;
}

export type ArrayPile<T> = T | ArrayPile<T>[];

export function depile<T>(pile: ArrayPile<T>): T[] {
  if (Array.isArray(pile)) return pile.map(depile).flat();
  return [pile];
}

export async function runCommands(commands: ArrayPile<Command>): Promise<void> {
  // eslint-disable-next-line no-restricted-syntax
  for (const command of depile(commands)) {
    // eslint-disable-next-line no-await-in-loop
    await command.exec();
  }
}
