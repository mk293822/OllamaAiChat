import axios from "axios";
import { getCookie } from "./helper";

const token = getCookie('auth_token');

const api = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${decodeURIComponent(token?? "")}`
  },
});

export default api;