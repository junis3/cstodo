import { ReplySuccessCommand } from '../../command/replySuccess';
import { setMuted } from '../../database/user';
import { TodoRouter } from '../router';

const onTodoMute: TodoRouter = async ({ event, user }) => {
  const { text } = event;
  const tokens = text.split(' ').map((token) => token.trim());

  if (tokens[1] === 'mute') {
    await setMuted(user.command, true);
    return new ReplySuccessCommand(event, user, `이제 ${user.command} 봇이 응답을 조용히 전달합니다.`, { muted: false });
  }
  await setMuted(user.command, false);
  return new ReplySuccessCommand(event, user, `이제 ${user.command} 봇이 응답을 시끄럽게 보냅니다.`, { muted: false });
};

export default onTodoMute;
