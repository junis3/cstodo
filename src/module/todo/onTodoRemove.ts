import { UserType } from '../../database/user';
import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/theme';
import { replySuccess, replyDdokddul, replyFail, ForceMuteType } from '../../etc/postMessage';
import { Query } from 'mongoose';
import { QueryType } from '../../etc/parseQuery';
import preprocessContent from '../../etc/preprocessContent';
import { isInteger } from '../../etc/isInteger';
import { SlackMessageEvent } from '../../slack/event';


const onTodoRemove = async ({ command }: QueryType, event: SlackMessageEvent, user: UserType) => {
    const todo = await getCstodos(user.id);
    
    if (command.length === 1) {
      await replyDdokddul(event, user, `remove 쿼리에 인자가 없으면 똑떨이에요...`);
      return;
    } 


    let contents = new Set<string>();

    for (let s of command.slice(1).join(' ').split(',')) {
      let content = preprocessContent(s);

      if (!content) continue;
      if (!isInteger(content)) {
        if (!todo.find((item) => item.content === content)) {
          await replyDdokddul(event, user, `할 일에 없는 *${content}* 를 빼면 똑떨이에요...`);
          return;
        }
      } else {
        let x = Number.parseInt(content);

        if (x <= 0 || x > todo.length) {
          await replyDdokddul(event, user, `할 일이 ${todo.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요...`);
          return;
        }
        
        content = todo[x-1].content;
      }
      contents.add(content);
    }

    for(let content of Array.from(contents)) {
      if (await removeCstodo({ owner: user.id, content })) {
        await replySuccess(event, user, `${user.name}님의 할 일에서 *${content}* 를 제거했어요!`, 'remove', {
          forceMuteType: user.userControl === 'blacklist' ? ForceMuteType.Unmute : undefined
        });
      } else {
        await replyFail(event, user, `${user.name}님의 할 일에서 *${content}* 를 제거하는 데 실패했어요...`);
      }
    }
}

export default onTodoRemove;