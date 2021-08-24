import { UserType } from '../../database/user';
import { getCstodos, removeCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';

  
const onCstodoOverflow = async (event: any, user: UserType) => {
    const cstodo = await getCstodos(user.id);

    const maxLen = Math.max(...cstodo.map((item) => item.content.length));
    const sumLen = cstodo.map((item) => item.content.length).reduce((x, y) => x + y, 0);

    if (sumLen <= 400 || cstodo.length <= 30) return false;

    while (true) {
        let i = Math.floor(Math.random() * cstodo.length);
  
        if (Math.random() < cstodo[i].content.length / maxLen) {
          let content = cstodo[i].content;
  
          await removeCstodo({ owner: user.id, content });
  
          await replyMessage(event, {
            text: `${user.name}님의 할 일이 너무 많습니다.. ${user.name}님의 할 일에서 무작위로 '${content}'를 골라서 제거했으니 수고하십시오..`,
            icon_emoji: ':putin:',
            channel: event.channel,
            username: 'Влади́мир Пу́тин',
          });
          
          break;
        }
    }

    return true;
}

export default onCstodoOverflow;