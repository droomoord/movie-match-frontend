import axios from "axios";
const fetchServerData = async (method, path, data) => {
  let location;
  if (process.env.VUE_APP_ENVIRONMENT === "local")
    location = process.env.VUE_APP_LOCAL_HOST;
  else location = "";
  try {
    const api = await axios({
      method,
      url: `${location}/v1${path}`,
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
