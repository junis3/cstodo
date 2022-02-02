import { UserType } from '../database/user';
import { SlackMessageEvent } from '../command/event';
import { CommandInterface } from '../command';
import { QueryType } from '../etc/parseQuery';

export type CommandRouter<T> = (context: T) => CommandInterface | PromiseLike<CommandInterface>;

export type MessageRouter<Info = {}> = CommandRouter<{ event: SlackMessageEvent } & Info>;

export type TodoRouter = MessageRouter<{ user: UserType, query: QueryType }>;
