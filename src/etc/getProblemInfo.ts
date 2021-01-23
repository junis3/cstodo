import axios from "axios";
import cheerioModule from "cheerio";

const getProblemInfo = async (id: number) => {
    let [solvedResp, bojResp] = await Promise.all([
        axios.get(`https://api.solved.ac/v2/problems/show.json?id=${id}`),
        axios.get(`https://www.acmicpc.net/problem/${id}`),
    ]);

    if (solvedResp.status != 200) throw new Error('Solved.ac api returned non-200.');
    if (bojResp.status != 200) throw new Error('BOJ returned non-200.');

    const title : string = solvedResp.data.result.problems[0].title;
    const levelNum : number = solvedResp.data.result.problems[0].level;
    const level = ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][Math.floor((levelNum-1)/5+0.000001)] + `${5 - (levelNum-1)%5}`;

    const $ = cheerioModule.load(bojResp.data);
    const $source = $('p', 'section#source').eq(0).children('a');
    
    let source : string[] = [];
    $source.map((i, element) => {
        source.push($(element).text());
    });

    return {
        id,
        level,
        title,
        source, // Only accepts first source tree as a string array
    }
}

getProblemInfo(7982).then(({ source }) => console.log(source));

export default getProblemInfo;