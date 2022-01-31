import { UserType } from '../database/user';
import { SlackMessageEvent } from '../command/event';
import { ArrayPile, Command } from '../command';
import { QueryType } from '../etc/parseQuery';

export type MessageRouter<Info = {}>
  = (context: { event: SlackMessageEvent } & Info)
    => ArrayPile<Command> | PromiseLike<ArrayPile<Command>>;

export type TodoRouter = MessageRouter<{ user: UserType, query: QueryType }>;

export function joinRouters<T>(...routers: MessageRouter<T>[]): MessageRouter<T> {
  return async (context) => {
    const result: ReturnType<MessageRouter<T>> = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const router of routers) {
      // eslint-disable-next-line no-await-in-loop
      result.push(await Promise.resolve(router(context)));
    }

    return result;
  };
}
