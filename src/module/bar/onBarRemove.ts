import { UserType } from '../../database/user';
import { replySuccess, replyDdokddul, replyFail } from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import preprocessContent from '../../etc/preprocessContent';
import { isInteger } from '../../etc/isInteger';
import { getBars, removeBar } from '../../database/bar';


const onBarRemove = async ({ command }: QueryType, event: any, user: UserType) => {
    const bars = await getBars(user.id);
    
    if (command.length === 1) {
      await replyDdokddul(event, user, `remove 쿼리에 인자가 없으면 똑떨이에요...`);
      return;
    } 


    let contents = new Set<string>();

    for (let s of command.slice(1).join(' ').split(',')) {
      let content = preprocessContent(s);

      if (!isInteger(content)) {
        if (!bars.find((item) => item.content === content)) {
          await replyDdokddul(event, user, `할 일에 없는 *${content}* 를 빼면 똑떨이에요...`);
          return;
        }
      } else {
        let x = Number.parseInt(content);

        if (x <= 0 || x > bars.length) {
          await replyDdokddul(event, user, `할 일이 ${bars.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요...`);
          return;
        }
        
        content = bars[x-1].content;
      }
      contents.add(content);
    }

    for(let content of Array.from(contents)) {
      if (await removeBar({ owner: user.id, content })) {
        await replySuccess(event, user, `${user.name}님의 진행중인 일에서 *${content}* 를 제거했어요!`, 'remove', {forceUnmute: (user.userControl === 'blacklist')});
      } else {
        await replyFail(event, user, `${user.name}님의 진행중인 일에서 *${content}* 를 제거하는 데 실패했어요...`);
      }
    }
}

export default onBarRemove;