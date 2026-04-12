import axios from "axios";

/**
 * Removes trailing slashes from a configured API base URL.
 * @param {string | undefined} value Raw URL value.
 * @returns {string} Normalized URL without trailing slash.
 */
const normalizeBaseUrl = (value) => {
  if (!value) {
    return "";
  }

  return value.replace(/\/+$/, "");
};

/**
 * Shared Axios client for frontend API calls.
 * @type {import("axios").AxiosInstance}
 */
export const api = axios.create({
  baseURL: normalizeBaseUrl(process.env.REACT_APP_API_URL),
});
