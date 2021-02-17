import axios from "axios";
const fetchMovieData = async (method, path) => {
  try {
    const api = await axios({
      method,
      url: `https://api.themoviedb.org/3${path}`,
      headers: {
        Authorization: "Bearer " + process.env.VUE_APP_TMDB_API_KEY,
      },
    });
    return api;
  } catch (error) {
    console.log(error);
  }
};

export default fetchMovieData;
