import { UserType } from '../../database/user';
import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';

  
const onCstodoLength = async (event: any, user: UserType) => {
    const cstodo = await getCstodos(user.id);

    await replyMessage(event, {
        username: `${user.name}님의 비서`,
        text: `와... ${user.name}님이 할 일이 총 ${cstodo.length} 개가 있어요... ${emoji('cs')}`,
        channel: event.channel,
        icon_emoji: emoji('default'),
    });
}

export default onCstodoLength;