import axios from "axios";

const API = axios.create({
  baseURL: "https://rent-tracker-backend-1.onrender.com"
});

export function setToken(token){
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default API;
