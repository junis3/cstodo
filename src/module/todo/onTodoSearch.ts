import { UserType } from '../../database/user';
import { CstodoType, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyMessage } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';

// Needs refactor......
const onTodoSearch = async (rawQuery: QueryType, event: any, user: UserType) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    const query = tokens.slice(2).join(' ').trim();

    const cstodos = await getCstodos(user.id);
    
    const result = await new Promise<CstodoType[] | null>((resolve, reject) => {
        setTimeout(() => resolve(null), 3000);

        const result = cstodos.filter((todo) => {
          return todo.content.toLowerCase().search(new RegExp(String.raw`${query.toLowerCase()}`)) !== -1;
        });
        resolve(result);
    });

    let message: string;
    let icon_emoji = emoji('default', user.theme);
    let username = `${user.name}님의 비서`;

    if (result === null) {
      message = '무슨 검색어를 넣었길래 이렇게 오래 걸려요?;;;';
      icon_emoji = emoji('ddokddul', user.theme);
      username = `${user.name}님의 똑떨한 비서`
    } else if (result.length === 0) {
<<<<<<< HEAD
      message = `> ${user.name}님의 할 일에 찾으시는 '${query}'가 없습니다..ㅠㅠ`;
    } else {
      message = `${user.name}님의 할 일에서 '${query}'를 검색한 결과입니다:`;
      message += result.map((value) => `\n> *${value.content}*`);  
=======
<<<<<<< HEAD
      message = `${user.name}님의 할 일에 찾으시는 *${query}* 가 없습니다..ㅠㅠ`;
    } else {
      message = `${user.name}님의 할 일에서 *${query}* 를 검색한 결과입니다:`;
      message += result.map((value) => `\n*${value.content}*`);  
=======
      message = `> ${user.name}님의 할 일에 찾으시는 '${query}'가 없습니다..ㅠㅠ`;
    } else {
      message = `${user.name}님의 할 일에서 '${query}'를 검색한 결과입니다:`;
      message += result.map((value) => `\n> *${value.content}*`);  
>>>>>>> link preview prevention & rich text
>>>>>>> link preview prevention & rich text
    }

    
    await replyMessage(event, user, {
      text: message,
      channel: event.channel,
      icon_emoji,
      username,
    })
    return;
}

export default onTodoSearch;