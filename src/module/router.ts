import { UserType } from '../database/user';
import { SlackMessageEvent } from '../slack/event';
import { ArrayPile, SlackCommand } from '../slack/command';
import { QueryType } from '../etc/parseQuery';


export type MessageRouter<Info = {}> = (context: { event: SlackMessageEvent } & Info) => ArrayPile<SlackCommand> | PromiseLike<ArrayPile<SlackCommand>>;

export type TodoRouter = MessageRouter<{ user: UserType, query: QueryType }>;

export function joinRouters<T>(...routers: MessageRouter<T>[]): MessageRouter<T> {
    return async (context) => {
        let result: ReturnType<MessageRouter<T>> = [];

        for (let router of routers) {
            result.push(await Promise.resolve(router(context)));
        }

        return result;
    }
}