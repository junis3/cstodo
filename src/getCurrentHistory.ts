import axios from "axios";
import cheerioModule from "cheerio";
import voca from "voca";

const getHTML = async () => {
    try {
        return await axios.get('https://www.acmicpc.net/user/cs71107');
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getCurrentHistory = async () => {
    const result = await getHTML();

    console.log('Axios returned status ' + result.status);
    
    const $ = cheerioModule.load(result.data);

    const $history = $('div.panel-body');

    let history = $history.eq(0).text();

    history = voca.replaceAll(history, '\t', '');
    history = voca.trim(history);
    
    return history.split('\n');
}

export default getCurrentHistory;