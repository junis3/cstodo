import axios from 'axios';
import cheerioModule from 'cheerio';
import { HistoryType } from '../database/history';

const getProblemInfo = async (id: number) => {
  const [solvedResp, bojResp] = await Promise.all([
    axios.get(`https://solved.ac/api/v3/problem/show?problemId=${id}`),
    axios.get(`https://www.acmicpc.net/problem/${id}`, {
      headers: {
        'User-Agent': 'cstodo',
      },
    }),
  ]);

  if (solvedResp.status != 200)
    throw new Error(
      `Solved.ac api returned non-200 status: ${solvedResp.status} ${solvedResp.statusText}`
    );
  if (bojResp.status != 200)
    throw new Error(
      `BOJ returned non-200 status: ${bojResp.status} ${bojResp.statusText}`
    );

  console.log(`Loaded information of problem ${id} with status 200.`);

  const title: string = solvedResp.data.titleKo;
  const levelNum: number = solvedResp.data.level;
  const level = (() => {
    if (levelNum > 0)
      return `${
        ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][
          Math.floor((levelNum - 1) / 5 + 0.000001)
        ]
      }${5 - ((levelNum - 1) % 5)}`;
    return 'unranked';
  })();

  const $ = cheerioModule.load(bojResp.data);
  const $source = $('p', 'section#source').eq(0).children('a');

  const source: string[] = [];
  $source.map((i, element) => {
    source.push($(element).text());
  });

  return {
    id,
    level,
    title,
    source: source.join(' '), // Only accepts first source tree as a string array
  } as HistoryType;
};

export default getProblemInfo;
