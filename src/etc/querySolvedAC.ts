import axios from "axios";

const querySolvedAC = async (query = '') => {
    try {
      const urlSafeQuery : string = query.split('&').join('%26');
      console.log(urlSafeQuery)
      return await axios.get(`https://solved.ac/api/v3/search/problem?query=${urlSafeQuery}&sort=random`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
};

export default querySolvedAC;

const f = async () => {
  const x = await querySolvedAC(`(from:joisc|from:ktsc|tag:flow|(from:ioi&id:19929..&!(id:20067..20076)&!(id:20094..20103)&!(id:22307..22315))) -solved_by:koosaga`);
  console.log(x.data.count);
};
f();