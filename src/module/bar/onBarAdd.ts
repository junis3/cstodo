import { UserType } from '../../database/user';
import { replySuccess, replyDdokddul, ForceMuteType } from '../../etc/postMessage';
import { getArg, QueryType } from '../../etc/parseQuery';
import { isInteger } from '../../etc/isInteger';
import preprocessContent from '../../etc/preprocessContent';
import { addBar } from '../../database/bar';
import { validateBar } from '../../etc/validateBar';
import { SlackMessageEvent } from '../../command/event';
import makeUnique from '../../etc/makeUnique';

const isSlackDecoration = (text: string) => {
  const match = text.match(/[~_]+/);
  return match !== null && text === match[0];
};
const isQueryValid = (text: string) =>
  text.length > 0 && text.length <= 200 && !isSlackDecoration(text);

const isContentValid = (content: string[]) => {
  if (content.length === 0 || content.length > 25) {
    return `${content.length}개의 쿼리를 넣으시면 저는 똑떨이에요...`;
  }
  if (!content.every(isQueryValid)) {
    return `${content.length}개의 쿼리 중에 다음과 같이 이상한 게 있으면 저는 똑떨이에요...\n:one: 텍스트의 길이가 [1, 100]을 벗어나는 경우\n:two: 텍스트가 underscore(_)나 물결(~)로만 구성된 경우\n:three: 개발자가 잘못 짠 경우`;
  }
  return '';
};

const onBarAdd = async ({ command, args }: QueryType, event: SlackMessageEvent, user: UserType) => {
  const progArg = getArg(['--progress', '--prog', '-p'], args);
  const goalArg = getArg(['--goal', '-g'], args);

  let _prog = 0;
  if (progArg) {
    if (typeof progArg === 'string') {
      if (!isInteger(progArg)) {
        await replyDdokddul(
          event,
          user,
          '제가 너무 똑떨이라 말씀하신 진행 상태를 잘 이해를 못했어요... 죄송합니다...',
        );
        return;
      }
      _prog = Number.parseInt(progArg);
    } else {
      await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요... ${progArg.message}`);
      return;
    }
  }
  let _goal = 100;
  if (goalArg) {
    if (typeof goalArg === 'string') {
      if (!isInteger(goalArg)) {
        await replyDdokddul(
          event,
          user,
          '제가 너무 똑떨이라 말씀하신 목표를 잘 이해를 못했어요... 죄송합니다...',
        );
        return;
      }
      _goal = Number.parseInt(goalArg);
    } else {
      await replyDdokddul(event, user, `이런 이유로 저는 똑떨이에요... ${goalArg.message}`);
      return;
    }
  }
  const prog = _prog;
  const goal = _goal;

  const validationFailMsg = validateBar(prog, goal);
  if (validationFailMsg) {
    await replyDdokddul(event, user, validationFailMsg);
    return;
  }

  const contents = makeUnique(
    command.slice(1).join(' ').trim().split(',').map(preprocessContent),
  ).filter((x) => x.length > 0);

  const contentValidateErrMsg = isContentValid(contents);
  if (contentValidateErrMsg !== '') {
    await replyDdokddul(event, user, contentValidateErrMsg);
    return;
  }

  await Promise.all(
    contents.map(async (content) => {
      await addBar({
        content,
        owner: user.id,
        progress: prog,
        goal,
      });

      await replySuccess(
        event,
        user,
        `${user.name}님의 진행중인 일에 *${content}* 를 추가했어요!`,
        'add',
        {
          forceMuteType: user.userControl === 'blacklist' ? ForceMuteType.Unmute : undefined,
        },
      );
    }),
  );
};

export default onBarAdd;
