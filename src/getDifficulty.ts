import axios from "axios";


export const getDifficulty = async (id: number) => {
    let response = await axios.get(`https://api.solved.ac/v2/problems/show.json?id=${id}`);

    if (response.status != 200) throw new Error('Solved.ac api returned non-200.');

    const level = Math.round(response.data.result.problems[0].level);

    return ['bron', 'silv', 'gold', 'plat', 'dia', 'ruby'][(level-1)/5] + `${5 - (level-1)%5}`;
}
