import axios from "axios";

export default axios.create({
  baseURL: process.env.API_URL || `http://127.0.0.1:5000`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});
