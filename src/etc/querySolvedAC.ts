import axios from "axios";

const querySolvedAC = async (query = '') => {
    try {
      return await axios.get(`https://solved.ac/api/v3/search/problem?query=${query}&sort=random`, {
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