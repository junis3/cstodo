import { shuffleCstodo } from '../../database/cstodo';
import { emoji } from '../../etc/cstodoMode';
import { webClient } from '../../index';

const onCstodoShuffle = async (event: any) => {
    await shuffleCstodo();

    await webClient.chat.postMessage({
      text: `cs님의 할 일들을 모두 섞어두었어요!`,
      icon_emoji: emoji('hug'),
      channel: event.channel,
    });
}

export default onCstodoShuffle;