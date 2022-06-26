import { getLatestGreenGolds, greenGoldToHrefNoLevel, greenGoldToPlainText, GreenGoldType, removeGreenGold } from '../../database/greengold';
import { TodoRouter } from '../../router';
import { ReplyFailureCommand } from '../../command/ReplyFailureCommand';
import { ReplySuccessCommand } from '../../command/ReplySuccessCommand';
import { getArg, getArgFromRawArgString } from '../../etc/parseQuery';
import { chooseProblem, validateThenChooseProblem } from '../onDailyGreenGold';
import isAdmin from '../../etc/isAdmin';
import { getUser, setHWInitialTime, setHWQuery, setHWRepeatTime, setNumProbsPerCycle } from '../../database/user';
import querySolvedAC from '../../etc/querySolvedAC';
import getCurrentHistory from '../../etc/getCurrentHistory';
import stringToTime from '../../etc/stringToTime';
import timeToString from '../../etc/timeToString';

const onTodoHWRefresh: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  if(!isAdmin(event.user) && event.user != user.owner) {
    return new ReplyFailureCommand(event, user, `숙제 갱신은 관리자와 주인만 할 수 있어요...`)
  }
  await validateThenChooseProblem(user.command);
  return new ReplySuccessCommand(event, user, `숙제 갱신이 완료되었어요!`);
}

const onTodoHWPurge: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  if(!isAdmin(event.user) && event.user != user.owner) {
    return new ReplyFailureCommand(event, user, `숙제 정리는 관리자와 주인만 할 수 있어요...`)
  }
  const latestHW = await getLatestGreenGolds(user.command, 100);
  if(latestHW === null) {
    return new ReplyFailureCommand(event, user, `정리할 숙제가 없어서 똑떨이에요...`);
  }
  const currentHistory = await getCurrentHistory(user.bojHandle!!);
  const sourcedHWLength = latestHW.length;
  const solvedHW = latestHW.filter(hw => currentHistory.some((id) => id === hw.id));
  const solvedHWLength = solvedHW.length;
  const removalResult = await Promise.all(solvedHW.map(async hw => (await removeGreenGold(hw)) ? true : false));

  const purgedHWLength = removalResult.filter(result => result).length;
  const msg = `${sourcedHWLength}개의 숙제를 검토했습니다! 이미 푼 ${solvedHWLength}개 숙제 중 ${purgedHWLength}개를 성공적으로 제거했습니다.`; 

  return new ReplySuccessCommand(event, user, msg);
}

const onTodoHWList: TodoRouter = async({ query: {command, args, rawArgString}, event, user}) => {
  const listArg = getArg(['--list', '-l'], args);
  if(typeof listArg !== 'string') {
    return new ReplyFailureCommand(event, user, `숙제 이력 조회를 위한 인자 (-l)을 확인해주세요...`);
  }
  const numProblems = parseInt(listArg, 10);
  if (isNaN(numProblems) || numProblems < 1 || numProblems > 10) {
    return new ReplyFailureCommand(event, user, `조회할 숙제 개수는 1-10 사이의 양의 정수로 입력해주세요...`);
  }
  const problems = await getLatestGreenGolds(user.command, numProblems);
  if(problems === null || problems.length === 0) {
    return new ReplySuccessCommand(event, user, `${user.name}님의 숙제가 없습니다!`);
  }
  if(!problems.every(problem => problem !== undefined)) {
    return new ReplyFailureCommand(event, user, `숙제 정보를 가져오는데 실패했습니다.`);
  }
  const problemTexts = problems.map(problem => greenGoldToPlainText(problem));
  const txt2Display = `${user.name}님의 최근 ${problemTexts.length}개 숙제입니다!\n- ` + problemTexts.join('\n- ');
  return new ReplySuccessCommand(event, user, txt2Display);
}

const onTodoHWQuery: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  const numProblems = user.numProbsPerCycle || 1;
  const problems = await getLatestGreenGolds(user.command, numProblems);
  if (problems === null
    || problems.length === 0) {  
      return new ReplySuccessCommand(event, user, `${user.command}님의 남은 숙제가 없어요!`);
  }

  if(!problems.every(problem => problem !== undefined)) {
    return new ReplyFailureCommand(event, user, `숙제 데이터에 문제가 생겼어요... 관리자에게 문의해주세요.`);
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


const onTodoHWTime: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  const initialTime = user.initialTime;
  const repeatTime = user.repeatTime;
  if(initialTime === undefined || initialTime === 0 || repeatTime === undefined || repeatTime === 0) {
    return new ReplyFailureCommand(event, user, `${user.name}님의 숙제 주기나 시점이 설정되지 않은 것 같아요...`);
  }
  const nextFireTime = (fromTime: number) => {
    if (repeatTime <= 0 || fromTime < initialTime) return initialTime;
    return initialTime + repeatTime * Math.ceil((fromTime - initialTime) / repeatTime);
  };
  const nextTime = nextFireTime(new Date().getTime());
  return new ReplySuccessCommand(event, user, `${user.name}님의 다음 숙제는 ${timeToString(nextTime)}에 드리겠습니다! 지금은 ${repeatTime}마다 드리고 있어요.`);
}

const onTodoHWSet: TodoRouter = async ({ query: {command, args, rawArgString}, event, user}) => {
  if (!isAdmin(event.user) && event.user != user.owner) {
    return new ReplyFailureCommand(event, user, `숙제 설정은 관리자와 주인만 바꿀 수 있어요...`);
  }

  const numProblemsArg = getArgFromRawArgString(['-n', '--num'], rawArgString);
  if (typeof numProblemsArg === 'string') {
    const numProblems = parseInt(numProblemsArg, 10);
    if (isNaN(numProblems) || numProblems < 1 || numProblems > 10) {
      return new ReplyFailureCommand(event, user, `숙제 개수는 1-10 사이의 양의 정수로 입력해주세요...`);
    }
    await setNumProbsPerCycle(user.command, numProblems);
    return new ReplySuccessCommand(event, user, `${user.command}님의 숙제 개수를 ${numProblems}개로 설정했어요!`, { iconEmoji: 'hw' });
  }

  const hwQueryArg = getArgFromRawArgString(['-q', '--query'], rawArgString);
  if (typeof hwQueryArg === 'string') {
    const result = await querySolvedAC(hwQueryArg);
    const db_user = await getUser(user.command);
    const stable_num_of_probs = 3 * (db_user!!.numProbsPerCycle || 1);
    if (result.data.count < stable_num_of_probs) {
      return new ReplyFailureCommand(event, user, `설정하신 쿼리의 조건을 만족하는 문제가 ${stable_num_of_probs}개 미만이에요...`);
    }
    await setHWQuery(user.command, hwQueryArg);
    return new ReplySuccessCommand(event, user, `${user.command}님의 숙제 쿼리를 ${hwQueryArg}로 설정했어요!`, { iconEmoji: 'hw' });
  }

  const initialTimeArg = getArg(['-i', '--initialTime'], args);
  if(typeof initialTimeArg === 'string') {
    const initialTime = stringToTime(initialTimeArg);
    if (!initialTime) {
      return new ReplyFailureCommand(event, user, `제가 너무 바보같아서 말씀하신 시각(${initialTimeArg})을 잘 이해를 못했어요... 죄송합니다...`);
    }
    await setHWInitialTime(user.command, initialTime);
    return new ReplySuccessCommand(event, user, `${user.command}님의 숙제를 ${timeToString(initialTime)}부터 드리겠습니다!`);
  }

  const repeatTimeArg = getArg(['-t', '--repeatTime'], args);
  if(typeof repeatTimeArg === 'string') {
    const repeatTime = parseInt(repeatTimeArg);
    if (isNaN(repeatTime) || repeatTime < 1 || repeatTime > 10) {
      return new ReplyFailureCommand(event, user, `숙제 주기는 1-10 사이의 양의 정수 (일)로 입력해 주세요...`);
    }
    await setHWRepeatTime(user.command, repeatTime);
    return new ReplySuccessCommand(event, user, `앞으로 ${repeatTime}일마다 ${user.command}님의 숙제를 드리겠습니다!`);
  }

  return new ReplyFailureCommand(event, user, `숙제 관련 설정을 위한 인자 (-n|--num, -q|--query)를 입력해주세요...`);
}

const onTodoHW: TodoRouter = async ({ query: { command, args, rawArgString }, event, user }) => {
  
  if (command.length > 1 && command[1] === 'set') {
    return await onTodoHWSet({ query: {command, args, rawArgString}, event, user});
  }

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

  const getHelpArg = getArg(['--help', '-h'], args);
  if(typeof getHelpArg === 'string') {
    const help = `
    숙제 도움말 (2022.06.26 upd)
    
    1. "(command) hw" 뒤의 명령줄 인자
    아무것도 붙이지 않으면 현재 숙제 목록을 보여줍니다.
    *-h, --help*: 도움말을 보여줍니다.
    *-q, --query*: 숙제 쿼리를 검색합니다.
    *-r, --refresh*: 숙제를 강제 갱신합니다.
    *-p, --purge*: 이미 푼 숙제를 삭제합니다.
    *-l, --list (num)*: 숙제 목록을 최대 (num)개까지 plain text로 보여줍니다. num: 1-10
    *-t, --time*: 숙제 주기 및 다음 숙제가 갱신되는 시간을 보여줍니다.

    2. "(command) hw set" 뒤의 명령줄 인자
    *-n, --num*: 숙제 개수를 설정합니다. (1-10)
    *-q, --query (queryText)*: 숙제 쿼리를 설정합니다. queryText는 큰따옴표로 둘러싸야 합니다.
    *-i, --initialTime (timeString)*: 숙제를 받을 시점을 설정합니다. (timeString)은 "내일 오후 7시" 와 같이 한국어로 쓸 수 있습니다.
    *-t, --repeatTime (repeatDay)*: 숙제를 받을 주기를 설정합니다. (repeatDay)는 현재 1-7 사이의 일 단위만 지원합니다.
    `;
    return new ReplySuccessCommand(event, user, help, {iconEmoji: 'hug'});
  }

  const getQueryArg = getArg(['--query', '-q'], args);
  if(typeof getQueryArg === 'string') {
    return new ReplySuccessCommand(event, user, `${user.name}님의 숙제 쿼리는 \`${user.hwQuery!!}\` 입니다!`, { iconEmoji: 'hw' });
  }

  const forceRefreshArg = getArg(['--refresh', '-r'], args);
  if(typeof forceRefreshArg === 'string') {
    return await onTodoHWRefresh({ query: {command, args, rawArgString}, event, user});
  }

  const purgeArg = getArg(['--purge', '-p'], args);
  if(typeof purgeArg === 'string') {
    return await onTodoHWPurge({ query: {command, args, rawArgString}, event, user});
  }

  const listArg = getArg(['--list', '-l'], args);
  if(typeof listArg === 'string') {
    return await onTodoHWList({ query : {command, args, rawArgString}, event, user});
  }

  const timeArg = getArg(['--time', '-t'], args);
  if(typeof timeArg === 'string') {
    return await onTodoHWTime({ query: {command, args, rawArgString}, event, user});
  }

  return await onTodoHWQuery({ query: {command, args, rawArgString}, event, user});
};

export default onTodoHW;
