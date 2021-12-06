import { emoji } from '../../etc/theme';
import { replyDdokddul, replyMessage, replySuccess } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import { isThemeType, setTheme, UserType } from '../../database/user';
import preprocessContent from '../../etc/preprocessContent';
import { SlackMessageEvent } from '../../slack/event';

  
const onTodoTheme = async ({ command, args }: QueryType, event: SlackMessageEvent, user: UserType) => {
    const newTheme = preprocessContent(command[0]);

    if (!isThemeType(newTheme)) {
      await replyDdokddul(event, user, `현재 *${newTheme}* 테마는 지원하지 않아요... 죄송합니다... `);
      return;
    }

    await setTheme(user.command, newTheme);
    
    await replyMessage(event, user, {
      text: `${user.command}봇의 프로필이 *${newTheme}* 모드로 바뀌었습니다!`,
      channel: event.channel,
      icon_emoji: emoji('default', newTheme),
      username: `${user.name}님의 ${newTheme} 비서`,
    });
}

export default onTodoTheme;