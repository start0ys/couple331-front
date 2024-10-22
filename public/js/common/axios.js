import axios from "axios";


axios.defaults.withCredentials = true; // 쿠키 데이터를 전송받기 위해
export const request = (method, url, data) => {
  return axios({
    method,
    url,
    data,
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err + ` [Status: ${err.response.data.status} Message: ${err.response.data.message}]`);
      return err.response.data;
    });
};

