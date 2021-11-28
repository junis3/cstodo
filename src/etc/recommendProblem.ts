import axios from "axios";
import cheerioModule from "cheerio";
import voca from "voca";
import fs from "fs";
import { HistoryType } from '../database/history';

const querySolvedAC = async (username = 'Green55') => {
    try {
        return await axios.get(`https://solved.ac/api/v3/search/problem?query=-solved_by%3AGreen55%20tier%3Ag5..g1&sort=random`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const parseLevel = (levelNum: number) => {
    if (levelNum > 0) return ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][Math.floor((levelNum-1)/5+0.000001)] + `${5 - (levelNum-1)%5}`;
    else return 'unranked';
}



const recommendProblem = async () => {

    const result = await querySolvedAC();
    const problem = result.data.items[0];
    let id : number = 0;
    return {
        id: problem.problemId,
        title: problem.titleKo,
        level: parseLevel(problem.level),
        source: undefined,
    } as HistoryType;
}

recommendProblem().then((problem) => {
    console.log(problem);
})
// getCurrentHistory().then((history) => {
//     console.log(history);
// })

recommendProblem();

export default recommendProblem;