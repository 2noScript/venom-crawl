import axios from "axios";
import "dotenv/config";

export const instanceAxios = axios.create({
  baseURL: process.env.COMIC_API,
});

instanceAxios.defaults.headers.common["Content-Type"] = "application/json";

instanceAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function request(options) {
  return instanceAxios(options);
}
