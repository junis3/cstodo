import { isThemeType, setTheme } from '../../database/user';
import preprocessContent from '../../etc/preprocessContent';
import { TodoRouter } from '../../router';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';

const onTodoTheme: TodoRouter = async ({ event, user, query: { command } }) => {
  const newTheme = preprocessContent(command[0]);

  if (!isThemeType(newTheme)) {
    return new ReplyFailureCommand(
      event,
      user,
      `현재 *${newTheme}* 테마는 지원하지 않아요... 죄송합니다... `
    );
  }

  await setTheme(user.command, newTheme);

  return new ReplySuccessCommand(
    event,
    user,
    `${user.command}봇의 프로필이 *${newTheme}* 모드로 바뀌었습니다!`
  );
};

export default onTodoTheme;
