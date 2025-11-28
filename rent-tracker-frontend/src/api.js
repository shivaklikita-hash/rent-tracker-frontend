import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:10000"
});
export function setToken(token){
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export default API;
