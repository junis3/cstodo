import { HistoryType } from '../database/history';
import { getUser } from '../database/user';
import querySolvedAC from './querySolvedAC';

const parseLevel = (levelNum: number) => {
  if (levelNum > 0)
    return `${
      ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][Math.floor((levelNum - 1) / 5 + 0.000001)]
    }${5 - ((levelNum - 1) % 5)}`;
  return 'unranked';
};

const recommendProblem = async (todoCommand: string = 'greentodo') => {
  const user = await getUser(todoCommand);
  if (!user) return Array<HistoryType>();
  if (!user.hwQuery) return Array<HistoryType>();

  const query = user ? user.hwQuery || '' : '';
  const numProblems = user.numProbsPerCycle || 1;

  const result = await querySolvedAC(query);
  const problems = result.data.items.slice(0, numProblems);

  return problems.map(
    (problem: { problemId: any; titleKo: any; level: number }) =>
      ({
        id: problem.problemId,
        title: problem.titleKo,
        level: parseLevel(problem.level),
        source: undefined,
      } as HistoryType),
  );
};
export default recommendProblem;
