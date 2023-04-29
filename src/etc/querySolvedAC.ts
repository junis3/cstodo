import axios from 'axios';

const querySolvedAC = async (query = '') => {
  try {
    const urlSafeQuery: string = encodeURIComponent(
      query.split('&amp;').join('&')
    );
    const result = await axios.get(
      `https://solved.ac/api/v3/search/problem?query=${urlSafeQuery}&sort=random`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // eslint-disable-next-line no-console
    console.warn(
      `쿼리 ${query}를 만족하는 문제 개수는 ${result.data.count}개 입니다.`
    );
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
};

export default querySolvedAC;
