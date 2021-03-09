import { CstodoType, getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

const onCstodoSearch = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    const query = tokens.slice(2).join(' ').trim();

    const cstodos = await getCstodos();
    
    const result = await new Promise<CstodoType[] | null>((resolve, reject) => {
        setTimeout(() => resolve(null), 3000);

        const result = cstodos.filter((todo) => {
          return todo.content.search(new RegExp(String.raw`${query}`)) !== -1;
        });
        resolve(result);
    });

    let message: string;
    let icon_emoji = emoji('default');
    let username = 'cstodo';

    if (result === null) {
      message = '무슨 검색어를 넣었길래 이렇게 오래 걸려요?;;;';
      icon_emoji = emoji('ddokddul');
      username = '똑떨한 cstodo'
    } else if (result.length === 0) {
      message = `${emoji('cs')}님의 할 일에 찾으시는 '${query}'가 없습니다..ㅠㅠ`;
    } else {

      message = `${emoji('cs')}님의 할 일에서 '${query}'를 검색한 결과입니다:`;
      message += result.map((value) => `\n- ${value.content}`);  
    }

    
    await webClient.chat.postMessage({
      text: message,
      channel: event.channel,
      icon_emoji,
      username,
    })
    return;
}

export default onCstodoSearch;