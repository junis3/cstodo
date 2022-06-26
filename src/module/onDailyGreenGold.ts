import recommendProblem from '../etc/recommendProblem';
import { postMessage } from '../etc/postMessage';
import { history2Href, HistoryType } from '../database/history';
import {
  addGreenGold, getLatestGreenGolds,
} from '../database/greengold';
import getCurrentHistory from '../etc/getCurrentHistory';
import getProblemInfo from '../etc/getProblemInfo';
import { getUser } from '../database/user';
import { PostMessageCommand } from '../command/PostMessageCommand';

export const chooseProblem = async (todoCommand = 'greentodo') => {
  const user = await getUser(todoCommand);
  if (!user) return;
  const problems = await recommendProblem(todoCommand);
  const username = user.name;
  const home = user.home!!;

  await Promise.all(problems.map(async (problem: HistoryType) => {
    addGreenGold(user.command, { id: problem.id, title: problem.title });
  }));

  const hrefs = await Promise.all(
    problems.map(
      (problem: HistoryType) => history2Href(problem),
    ),
  );

  const href = hrefs.join(', ');
  const josa = hrefs.length > 1 ? '들은' : '는';
  await new PostMessageCommand({
    channel: home,
    text: `${username}님, 오늘의 문제${josa} ${href}입니다!`,
    username: 'GreenGold',
    icon_emoji: ':green55:',
  }).exec();
};

const worshipSuccess = async (problem: HistoryType, home: string) => {
  const href = history2Href(problem);
  await new PostMessageCommand({
    text: `:white_check_mark: ${href}`,
    channel: home,
    icon_emoji: ':blobgreenorz:',
    username: 'GreenGold',
  }).exec();
};

const blameFail = async (problem: HistoryType, home: string) => {
  const href = history2Href(problem);
  await new PostMessageCommand({
    text: `:x: ${href}`,
    channel: home,
    icon_emoji: ':blobgreensad:',
    username: 'GreenGold',
  }).exec();
};

export const validateProblem = async (todoCommand = 'greentodo') => {
  const user = await getUser(todoCommand);
  if (!user) return;
  const numProblems = user.numProbsPerCycle || 1;
  const greenGolds = await getLatestGreenGolds(user.command, numProblems);
  const home = user.home!!;
  if (greenGolds === null
    || !greenGolds.every((problem) => problem !== undefined)
    || greenGolds.length < numProblems) {
    await new PostMessageCommand({
      text: '봇 똑바로 안 만들어? 숙제가 없다잖아요...',
      channel: home,
      icon_emoji: ':blobfudouble:',
      username: 'GreenGold',
    }).exec();
    return;
  }

  const currentHistory = new Set(await getCurrentHistory(user.bojHandle!!));

  const problems = await Promise.all(greenGolds.map((problem) => getProblemInfo(problem.id!!)));

  const problemStatus = problems.map((problem) => ({
    problem,
    solved: currentHistory.has(problem.id),
  }));

  await Promise.all(problemStatus.map(({ problem, solved }) => {
    if (solved) return worshipSuccess(problem, home);
    return blameFail(problem, home);
  }));

  if (problemStatus.every(({ solved }) => solved)) {
    await new PostMessageCommand({
      text: ':dhk2:',
      channel: home,
      icon_emoji: ':blobgreenorz:',
      username: 'GreenGold',
    }).exec();
    await new PostMessageCommand({
      text: `*역사상 최고, ${user.name.toUpperCase()}*`,
      channel: home,
      icon_emoji: ':blobgreenorz:',
      username: 'GreenGold',
    }).exec();
  }

  if (problemStatus.every(({ solved }) => !solved)) {
    await new PostMessageCommand({
      text: ':blobghostnotlikethis: 너무해 :blobghostnotlikethis:',
      channel: home,
      icon_emoji: ':blobgreensad:',
      username: 'GreenGold',
    }).exec();
    await new PostMessageCommand({
      text: '어떻게 숙제를 안 할 수가 있어...',
      channel: home,
      icon_emoji: ':blobgreensad:',
      username: 'GreenGold',
    }).exec();
  }
};

export const validateThenChooseProblem = async (todoCommand: string) => {
  await validateProblem(todoCommand);
  await chooseProblem(todoCommand);
};
