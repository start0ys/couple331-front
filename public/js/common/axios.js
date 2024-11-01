import axios from "axios";


axios.defaults.withCredentials = true; // 쿠키 데이터를 전송받기 위해
export const request = (method, url, data, headers  = {}) => {
  return axios({
    method,
    url,
    data,
    headers
  })
    .then(res => {
      const data = res.data || {};
      if(!data.hasOwnProperty('httpStatus'))
        data.httpStatus = res.status;
      return data;
    })
    .catch(err => {
      console.log(err + ` [Status: ${err?.response?.data?.status} Message: ${err?.response?.data?.message} HttpStatus: ${err?.response?.status}]`);
      const data = err?.response?.data || {};
      if(!data.hasOwnProperty('httpStatus'))
        data.httpStatus = err?.response?.status;
      return data;
    });
};

