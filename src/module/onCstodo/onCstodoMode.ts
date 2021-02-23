import { cstodoMode, emoji, setCstodoMode } from '../../etc/cstodoMode';
import { webClient } from '../../index';

  
const onCstodoPop = async (event: any) => {
    const text : string = event.text;
    const tokens = text.split(' ').map((token) => token.trim());
    
    setCstodoMode(tokens[1]);
    
    await webClient.chat.postMessage({
      text: `cstodo의 프로필이 ${cstodoMode} 모드로 바뀌었습니다.`,
      channel: event.channel,
      icon_emoji: emoji('default'),
      usename: `cstodo(${cstodoMode})`,
    });
}

export default onCstodoPop;