import { UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { TodoReplyCommand } from './reply';
import { TodoRouter } from '../router';

// TODO: Add subcommands and add argument details

const helpText = (user: UserType) => {
  const { name } = user;
  const { command } = user;
  return `${name}님의 비서 - ${command} 봇 사용설명서
\`${command}\`: ${name}님의 할 일 목록을 볼 수 있습니다.
\`${command} add [내용] -d [마감일]\`: ${name}님의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
\`${command} remove [번호]\`: ${name}님의 할 일 목록에 항목을 뺄 수 있습니다.
\`${command} edit [번호] -c [수정할 내용] -d [수정할 마감일]\`: ${name}님의 할 일 목록에 있는 항목을 수정할 수 있습니다.
\`${command} mute\` 또는 \`${command} unmute\`: ${command} 봇이 시끄러울 때에, 응답을 조용히 전달하게 할 수 있습니다.
\`${command} blob\` 또는 \`${command} weeb\`: ${command} 봇의 프로필을 바꿀 수 있습니다.`;
};

const onTodoHelp: TodoRouter = async ({ event, user }) => new TodoReplyCommand(event, user, {
  text: helpText(user),
  channel: event.channel,
  icon_emoji: emoji('help', user.theme),
  username: `친절한 ${user.name}님의 비서`,
});

export default onTodoHelp;
