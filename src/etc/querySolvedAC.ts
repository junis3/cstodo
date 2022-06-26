import axios from "axios";

const querySolvedAC = async (query = '') => {
    try {
      const urlSafeQuery : string = query.split('&').join(' ').split('|').join('%7C')
      .split('(').join('%28').split(')').join('%29').split(':').join('%3A').split('.').join('%2E')
      .split('!').join('%21');
      const result = await axios.get(`https://solved.ac/api/v3/search/problem?query=${urlSafeQuery}&sort=random`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.warn(`쿼리 ${query}를 만족하는 문제 개수는 ${result.data.count}개 입니다.`);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
};

export default querySolvedAC;