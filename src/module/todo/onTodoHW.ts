import { getLatestGreenGolds, greenGoldToHrefNoLevel, GreenGoldType } from '../../database/greengold';
import { TodoRouter } from '../../router';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';
import { getArg } from '../../etc/parseQuery';
import { validateThenChooseProblem } from '../onDailyGreenGold';
import isAdmin from '../../etc/isAdmin';

const onTodoHW: TodoRouter = async ({ query: { command, args }, event, user }) => {
  const forceRefreshArg = getArg(['--refresh', '-r'], args);

  const numProblems = user.numProbsPerCycle || 1;
  const problems = await getLatestGreenGolds(user.command, numProblems);
  if (problems === null
    || !problems.every((problem) => problem !== undefined)
    || problems.length < numProblems) {
    return new ReplyFailureCommand(event, user, `${user.name}님은 숙제를 받은 적이 없어요... 관리자에게 다음 정보를 주시면 생성해드릴 거예요...\n- 숙제를 받고 싶은 주기와 시점\n- 숙제를 뽑는 solved.ac 쿼리\n- 한번에 받을 숙제 개수\n관리자가 귀찮아하면 지연될 수 있어요...`);
  }

  if(typeof forceRefreshArg == 'string') {
    if(!isAdmin(event.user) && event.user != user.owner) {
      return new ReplyFailureCommand(event, user, `숙제 갱신은 관리자와 주인만 할 수 있어요...`)
    }
    await validateThenChooseProblem(user.command);
    return new ReplySuccessCommand(event, user, `숙제 갱신이 완료되었어요!`);
  }

  const hrefs = await Promise.all(
    problems.map(
      (problem: GreenGoldType) => greenGoldToHrefNoLevel(problem),
    ),
  );
  const href = hrefs.join(', ');
  const josa = hrefs.length > 1 ? '들은' : '는';
  return new ReplySuccessCommand(event, user, `${user.name}님의 최근 숙제${josa} ${href}입니다!`, { iconEmoji: 'hw' });
};

export default onTodoHW;
