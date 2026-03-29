import axios from "axios";

const normalizeBaseUrl = (value) => {
  if (!value) {
    return "";
  }

  return value.replace(/\/+$/, "");
};

export const api = axios.create({
  baseURL: normalizeBaseUrl(process.env.REACT_APP_API_URL),
});
