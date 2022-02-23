import axios from 'axios';
import cheerioModule from 'cheerio';
import voca from 'voca';

const getHTML = async (username = 'cs71107') => {
  try {
    return await axios.get(`https://www.acmicpc.net/user/${username}`, {
      headers: {
        'User-Agent': 'cstodo'
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCurrentHistory = async (username = 'cs71107') => {
  const result = await getHTML(username);

  console.log(`Loaded currently solved problem with status ${result.status}`);

  const $ = cheerioModule.load(result.data);

  const $history = $('div.panel-body');

  let history = $history.eq(1).text();

  history = voca.replaceAll(history, '\t', '');
  history = voca.trim(history);

  return history.split(' ').map((idString) => Number.parseInt(idString));
};

export default getCurrentHistory;