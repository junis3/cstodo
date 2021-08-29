import { UserType } from '../../database/user';
import { emoji } from '../../etc/theme';
import { QueryType } from '../../etc/parseQuery';
import { replyMessage } from '../../etc/postMessage';

const helpText = (user: UserType) => {
    const name = user.name;
    const command = user.command;
    return `${name}님의 비서 - ${command} 봇 사용설명서
\`${command}\`: ${name}님의 할 일 목록 일부를 볼 수 있습니다.
\`${command} all\`: ${name}님의 할 일 목록 전체를 볼 수 있습니다.
\`${command} size\`: ${name}님의 할 일의 개수를 볼 수 있습니다.
\`${command} search\`: ${name}님의 할 일에 들어있는 항목을 정규표현식으로 검색할 수 있습니다.
\`${command} add [내용]\`: ${name}님의 할 일 목록에 새로운 항목을 넣을 수 있습니다.
\`${command} remove [내용]\`: ${name}님의 할 일 목록에 항목을 뺄 수 있습니다.
${command === 'cstodo' ? `\`${command} mute\` 또는 \`${command} unmute\`: ${command} 봇이 시끄러울 때에, 응답을 조용히 전달하게 할 수 있습니다.` : ''}
${command === 'cstodo' ? `\`${command} blob\` 또는 \`${command} weeb\`: ${command} 봇의 프로필을 바꿀 수 있습니다.` : ''}`
}
  
const onTodoHelp = async (query: QueryType, event: any, user: UserType) => {
    await replyMessage(event, user, {
      text: helpText(user),
      channel: event.channel,
      icon_emoji: emoji('help', user.theme),
      username: '친절한 cs71107',
    });
}

export default onTodoHelp;