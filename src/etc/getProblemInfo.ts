import axios from "axios";

const getProblemInfo = async (id: number) => {
    let response = await axios.get(`https://api.solved.ac/v2/problems/show.json?id=${id}`);

    if (response.status != 200) throw new Error('Solved.ac api returned non-200.');

    const title = response.data.result.problems[0].title;
    const levelNum = response.data.result.problems[0].level;
    const level = ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][Math.floor((levelNum-1)/5+0.000001)] + `${5 - (levelNum-1)%5}`;

    return {
        id,
        level,
        title,
    }
}

export default getProblemInfo