
export interface SlackMessageEvent {
    type: 'message';
    channel: string;
    user: string;
    text: string;
    ts: string;
    thread_ts?: string;
}
