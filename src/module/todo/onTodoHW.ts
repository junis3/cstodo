import { getLatestGreenGolds, greenGoldToHrefNoLevel, GreenGoldType } from '../../database/greengold';
import { TodoRouter } from '../../router';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';
import { getArg } from '../../etc/parseQuery';
import { chooseProblem, validateThenChooseProblem } from '../onDailyGreenGold';
import isAdmin from '../../etc/isAdmin';

const onTodoHWRefresh: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  if(!isAdmin(event.user) && event.user != user.owner) {
    return new ReplyFailureCommand(event, user, `숙제 갱신은 관리자와 주인만 할 수 있어요...`)
  }
  await validateThenChooseProblem(user.command);
  return new ReplySuccessCommand(event, user, `숙제 갱신이 완료되었어요!`);
}

const onTodoHWQuery: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  const numProblems = user.numProbsPerCycle || 1;
  const problems = await getLatestGreenGolds(user.command, numProblems);
  if (problems === null
    || !problems.every((problem) => problem !== undefined)
    || problems.length < numProblems) {  
      await chooseProblem(user.command);    
      return new ReplySuccessCommand(event, user, `${user.command}님의 숙제가 조건과 맞지 않아 갱신되었어요!`);
  }

  const hrefs = await Promise.all(
    problems.map(
      (problem: GreenGoldType) => greenGoldToHrefNoLevel(problem),
    ),
  );
  const href = hrefs.join(', ');
  const josa = hrefs.length > 1 ? '들은' : '는';
  return new ReplySuccessCommand(event, user, `${user.name}님의 최근 숙제${josa} ${href}입니다!`, { iconEmoji: 'hw' });
}

const onTodoHW: TodoRouter = async ({ query: { command, args, rawArgString }, event, user }) => {
  if (
    user.hwQuery === undefined ||
    user.hwQuery.length === 0 ||
    user.bojHandle === undefined ||
    user.bojHandle.length === 0 ||
    user.home === undefined ||
    user.home.length === 0 ||
    user.owner === undefined ||
    user.owner.length === 0
  ) {
    return new ReplyFailureCommand(event, user, `${user.name}님의 숙제가 등록되지 않은 것 같아요... cstodo-dev 채널에 문의해주세요.`);
  }

  const forceRefreshArg = getArg(['--refresh', '-r'], args);
  if(typeof forceRefreshArg == 'string') {
    return await onTodoHWRefresh({ query: {command, args, rawArgString}, event, user});
  }

  return await onTodoHWQuery({ query: {command, args, rawArgString}, event, user});
};

export default onTodoHW;
