import { WebClient } from '@slack/web-api';
import { accessToken } from '../config';

export const webClient = new WebClient(accessToken);

export interface SlackCommand {
    exec(): Promise<void>;
}

export type ArrayPile<T> = T | ArrayPile<T>[];

export function depile<T>(pile: ArrayPile<T>): T[] {
  if (Array.isArray(pile)) return pile.map(depile).flat();
  return [pile];
}

export async function runCommands(commands: ArrayPile<SlackCommand>): Promise<void> {
  await Promise.all(depile(commands).map((c) => c.exec()));
}
