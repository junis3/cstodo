import { UserType } from '../../database/user';
import {
  replySuccess, replyDdokddul, replyFail, ForceMuteType,
} from '../../etc/postMessage';
import { QueryType } from '../../etc/parseQuery';
import preprocessContent from '../../etc/preprocessContent';
import { isInteger } from '../../etc/isInteger';
import { getBars, removeBar } from '../../database/bar';
import { SlackMessageEvent } from '../../command/event';

const onBarRemove = async ({ command }: QueryType, event: SlackMessageEvent, user: UserType) => {
  const bars = await getBars(user.id);

  if (command.length === 1) {
    await replyDdokddul(event, user, 'remove 쿼리에 인자가 없으면 똑떨이에요...');
    return;
  }

  const contents = new Set<string>();

  // eslint-disable-next-line no-restricted-syntax
  for (const s of command.slice(1).join(' ').split(',')) {
    let content = preprocessContent(s);

    if (!content) continue;
    if (!isInteger(content)) {
      await replyDdokddul(event, user, '뺄 일의 번호를 알려주세요... 내용을 알려주시면 똑떨이에요...');
      return;
    }
    const x = Number.parseInt(content, 10);

    if (x <= 0 || x > bars.length) {
      await replyDdokddul(event, user, `할 일이 ${bars.length}개인데 여기서 ${x}번째 할 일을 빼면 똑떨이에요...`);
      return;
    }

    content = bars[x - 1].content;

    contents.add(content);
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const content of Array.from(contents)) {
    if (await removeBar({ owner: user.id, content })) {
      await replySuccess(event, user, `${user.name}님의 진행중인 일에서 *${content}* 를 제거했어요!`, 'remove', {
        forceMuteType: user.userControl === 'blacklist' ? ForceMuteType.Unmute : undefined,
      });
    } else {
      await replyFail(event, user, `${user.name}님의 진행중인 일에서 *${content}* 를 제거하는 데 실패했어요...`);
    }
  }
};

export default onBarRemove;
