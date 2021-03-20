import { emoji } from '../../etc/cstodoMode';
import { replyMessage } from '../../etc/postMessage';
import { webClient } from '../../index';

const helpText = () => {
    const cs = emoji('cs');
    return `:god: ${cs} cstodo봇 ${cs} :god:
\`cstodo\`: ${cs}의 할 일 목록을 볼 수 있습니다.
\`cstodo blob\` 또는 \`cstodo weeb\`: cstodo의 프로필을 바꿀 수 있습니다.
\`cstodo mute\` 또는 \`cstodo unmute\`: cstodo가 시끄러울 때에, 응답을 조용히 전달하게 할 수 있습니다.
\`cstodo format (페이지번호)\`: ${cs}의 할 일 목록을 보다 예쁘게 볼 수 있습니다.
\`cstodo size\`: ${cs}의 할 일의 개수를 볼 수 있습니다.
\`cstodo search\`: ${cs}의 할 일에 들어있는 항목을 정규표현식으로 검색할 수 있습니다.
\`cstodo add [내용]\`: ${cs}의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
\`cstodo remove [내용]\`: ${cs}의 할 일 목록에 항목을 뺄 수 있습니다.
\`cstodo pop\`: ${cs}의 마지막 할 일을 뺍니다.
\`cstodo shuffle\`: ${cs}의 할 일을 무작위로 섞습니다.`
}
  
const onCstodoPop = async (event: any) => {
    await replyMessage(event, {
      text: helpText(),
      channel: event.channel,
      icon_emoji: emoji('help'),
      username: '친절한 cs71107',
    });
}

export default onCstodoPop;