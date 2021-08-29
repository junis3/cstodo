import { emoji } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import { isThemeType, setTheme, UserType } from '../../database/user';
import preprocessContent from '../../etc/preprocessContent';

  
const onTodoTheme = async ({ command, args }: QueryType, event: any, user: UserType) => {
    const newTheme = preprocessContent(command[0]);

    if (!isThemeType(newTheme)) {
      await replyMessage(event, user, {
        text: `현재 *${newTheme}* 테마는 지원하지 않습니다. 죄송합니다ㅠㅠ`,
        channel: event.channel,
        icon_emoji: emoji('ddokddul', user.theme),
        usename: `${user.command}님의 똑떨한 비서`,
      });
      return;
    }

    await setTheme(user.command, newTheme);
    
    await replyMessage(event, user, {
      text: `${user.command}봇의 프로필이 *${newTheme}* 모드로 바뀌었습니다!`,
      channel: event.channel,
      icon_emoji: emoji('default', newTheme),
      usename: `${user.command}님의 ${newTheme} 비서`,
    });
}

export default onTodoTheme;