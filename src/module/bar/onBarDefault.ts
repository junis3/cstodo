import { getBars } from '../../database/bar';
import { isThemeType, UserType } from '../../database/user';
import { QueryType } from '../../etc/parseQuery';
import { formatBar } from './barFormatter';
import { replySuccess } from '../../etc/postMessage';
import { emoji } from '../../etc/theme';
const bulletEmoji = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];

const onBarDefault = async (query: QueryType, event: any, user: UserType) => {
    const allBars = await getBars(user.id);
    const bars = allBars.slice(0, 10);

    let message = `${user.name}님의 진행중인 일이 없습니다! ${emoji('add', user.theme)}`
    
    if (bars.length > 0)
        message = bars.map((bar, k) => `${bulletEmoji[k]} *${bar.content}* ${formatBar(bar, user)}`).join('\n');

    if (bars.length < allBars.length)
        message += `\n이 밖에도 ${user.name}님의 진행중인 일이 ${allBars.length - bars.length}개나 더 있어요... ${emoji('add', user.theme)}`;

    await replySuccess(event, user, message, 'default');
    return;
}

export default onBarDefault;