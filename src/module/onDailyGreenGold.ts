import recommendProblem from '../etc/recommendProblem';
import { postMessage } from '../etc/postMessage';
import { history2Href, HistoryType } from '../database/history';
import {
  addGreenGold, getLatestGreenGolds, greenGoldToHrefNoLevel, GreenGoldType,
} from '../database/greengold';
import getCurrentHistory from '../etc/getCurrentHistory';
import getProblemInfo from '../etc/getProblemInfo';
import { getUser, UserType } from '../database/user';

export const validateThenChooseProblem = async (todoCommand: string) => {
  await validateProblem(todoCommand);
  await chooseProblem(todoCommand);
}

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
  const josa = href.length > 1 ? '들은' : '는';
  await postMessage({
    text: `${username}님, 오늘의 문제${josa} ${href}입니다!`,
    channel: home,
    icon_emoji: ':green55:',
    username: 'GreenGold',
  });
};

export const validateProblem = async (todoCommand = 'greentodo') => {
  const user = await getUser(todoCommand);
  if (!user) return;
  const numProblems = user.numProbsPerCycle || 1;
  const problems = await getLatestGreenGolds(user.command, numProblems);
  const home = user.home!!;
  if (problems === null || !problems.every((problem) => problem !== undefined) || problems.length < numProblems) {
    await postMessage({
      text: '봇 똑바로 안 만들어? 숙제가 없다잖아요...',
      channel: home,
      icon_emoji: ':blobfudouble:',
      username: 'GreenGold',
    });
    return;
  }

  const currentHistory = await getCurrentHistory(user.bojHandle!!);

  const unsolvedProblems = problems.filter((problem) => !currentHistory.find((id) => id === problem.id));
  if (unsolvedProblems.length > 0) {
    const unsolvedInfos = await Promise.all(unsolvedProblems.map(async (problem: GreenGoldType) => await getProblemInfo(problem.id!!)));
    const hrefs = await Promise.all(
      unsolvedInfos.map(
        (problem: HistoryType) => history2Href(problem),
      ),
    );
    const href = hrefs.join(', ');
    await blameFail(href, home);
  } else {
    const infos = await Promise.all(problems.map(async (problem: GreenGoldType) => await getProblemInfo(problem.id!!)));
    const hrefs = await Promise.all(
      infos.map(
        (problem: HistoryType) => history2Href(problem),
      ),
    );
    const href = hrefs.join(', ');
    await worshipSuccess(href, home, user);
  }
};

const worshipSuccess = async (href : string, home : string, user: UserType) => {
  await postMessage({
    text: `${href} : `,
    channel: home,
    icon_emoji: ':blobgreenorz:',
    username: 'GreenGold',
  });
  await postMessage({
    text: ':dhk2:',
    channel: home,
    icon_emoji: ':blobgreenorz:',
    username: 'GreenGold',
  });
  await postMessage({
    text: `*역사상 최고, ${user.name.toUpperCase()}*`,
    channel: home,
    icon_emoji: ':blobgreenorz:',
    username: 'GreenGold',
  });
};

const blameFail = async (href: string, home: string) => {
  await postMessage({
    text: `${href} : `,
    channel: home,
    icon_emoji: ':blobgreensad:',
    username: 'GreenGold',
  });
  await postMessage({
    text: ':blobghostnotlikethis:',
    channel: home,
    icon_emoji: ':blobgreensad:',
    username: 'GreenGold',
  });
  await postMessage({
    text: '너무해',
    channel: home,
    icon_emoji: ':blobgreensad:',
    username: 'GreenGold',
  });
  await postMessage({
    text: ':blobghostnotlikethis:',
    channel: home,
    icon_emoji: ':blobgreensad:',
    username: 'GreenGold',
  });
  await postMessage({
    text: '어떻게 숙제를 안할 수가 있어',
    channel: home,
    icon_emoji: ':blobgreensad:',
    username: 'GreenGold',
  });
};
