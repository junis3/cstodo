import { UserType } from '../database/user';
import { SlackMessageEvent } from '../slack/event';
import { ArrayPile, SlackCommand } from '../slack/command';
import { QueryType } from '../etc/parseQuery';


export type MessageRouter<Info = {}> = (context: { event: SlackMessageEvent } & Info) => ArrayPile<SlackCommand> | PromiseLike<ArrayPile<SlackCommand>>;

export type TodoRouter = MessageRouter<{ user: UserType, query: QueryType }>;
