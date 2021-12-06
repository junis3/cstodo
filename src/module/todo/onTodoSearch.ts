import { UserType } from '../../database/user';
import { CstodoType, getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replyDdokddul, replySuccess } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import { SlackMessageEvent } from '../../slack/event';

// Needs refactor......
const onTodoSearch = async (rawQuery: QueryType, event: SlackMessageEvent, user: UserType) => {
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
    let isDdokddul = false;

    if (result === null) {
      message = '무슨 검색어를 넣었길래 이렇게 오래 걸려요?;;;';
      isDdokddul = true;
    } else if (result.length === 0) {
      message = `${user.name}님의 할 일에 찾으시는 '${query}'가 없습니다..ㅠㅠ`;
    } else {
      message = `${user.name}님의 할 일에서 '${query}'를 검색한 결과입니다:`;
      message += result.map((value) => `\n*${value.content}*`);
    }

    if (isDdokddul) {
      await replyDdokddul(event, user, message);
      return;
    }
    await replySuccess(event, user, message, 'search');
    return;
}

export default onTodoSearch;