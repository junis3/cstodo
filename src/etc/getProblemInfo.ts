import axios from 'axios';
import cheerioModule from 'cheerio';
import { HistoryType } from '../database/history';

const tiers: string[] = [
  'unranked',
  'bron5', 'bron4', 'bron3', 'bron2', 'bron1',
  'silv5', 'silv4', 'silv3', 'silv2', 'silv1',
  'gold5', 'gold4', 'gold3', 'gold2', 'gold1',
  'plat5', 'plat4', 'plat3', 'plat2', 'plat1',
  'dia5', 'dia4', 'dia3', 'dia2', 'dia1',
  'ruby5', 'ruby4', 'ruby3', 'ruby2', 'ruby1',
];

export const level2tier = (levelNum: number) => {
  return tiers[levelNum];}

export const tier2Level = (tier: string) => {
  return Math.max(0, tiers.indexOf(tier));
}

const getProblemInfo = async (id: number) => {
  const [solvedResp, bojResp] = await Promise.all([
    axios.get(`https://solved.ac/api/v3/problem/show?problemId=${id}`),
    axios.get(`https://www.acmicpc.net/problem/${id}`, {
      headers: {
        'User-Agent': 'cstodo'
      },
    }),
  ]);

  if (solvedResp.status != 200) throw new Error(`Solved.ac api returned non-200 status: ${solvedResp.status} ${solvedResp.statusText}`);
  if (bojResp.status != 200) throw new Error(`BOJ returned non-200 status: ${bojResp.status} ${bojResp.statusText}`);

  console.log(`Loaded information of problem ${id} with status 200.`);

  const title : string = solvedResp.data.titleKo;
  const levelNum : number = solvedResp.data.level;
  const level = level2tier(levelNum);

  const $ = cheerioModule.load(bojResp.data);
  const $source = $('p', 'section#source').eq(0).children('a');

  const source : string[] = [];
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
