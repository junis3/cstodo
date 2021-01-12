import axios from "axios";


export const getProblemInfo = async (id: number) => {
    let response = await axios.get(`https://api.solved.ac/v2/problems/show.json?id=${id}`);

    if (response.status != 200) throw new Error('Solved.ac api returned non-200.');

    const title = response.data.result.problems[0].title;
    const levelNum = response.data.result.problems[0].level;
    const level = ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][Math.round((levelNum-1)/5)] + `${5 - (levelNum-1)%5}`;

    return {
        id,
        level,
        title,
    }
}
