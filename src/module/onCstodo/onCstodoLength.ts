import { getCstodos } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

  
const onCstodoLength = async (event: any) => {
    const cstodo = await getCstodos();

    await webClient.chat.postMessage({
        text: `와... cs님의 할 일은 총 ${cstodo.length} 개가 있어요... ${emoji('cs')}`,
        channel: event.channel,
        icon_emoji: emoji('default'),
    });
}

export default onCstodoLength;