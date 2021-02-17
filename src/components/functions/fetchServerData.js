import axios from "axios";
const fetchServerData = async (method, path, data) => {
  try {
    const api = await axios({
      method,
      url: `${process.env.VUE_APP_SERVER_LOCATION}/v1${path}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      },
      data,
    });
    return api;
  } catch (error) {
    console.log("fetchServerData", error.response.data);
    return error.response;
  }
};

export default fetchServerData;
