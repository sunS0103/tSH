import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

const config = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
  },
};

const axiosClient = axios.create(config);

const setAxiosToken = (token: string) => {
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Initialize token from cookies if available
if (typeof window !== "undefined") {
  const token = getCookie("token") as string | undefined;
  if (token) {
    setAxiosToken(token);
  }
}

axiosClient.interceptors.request.use(
  function (request) {
    // Get token from cookies on each request (in case it was updated)
    if (typeof window !== "undefined") {
      const token = getCookie("token") as string | undefined;
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }
    return request;
  },
  null,
  { synchronous: true }
);

axiosClient.interceptors.response.use(
  function (response) {
    //Dispatch any action on success

    if (response.data?.token) {
      const token =
        typeof response.data.token === "string"
          ? response.data.token
          : JSON.stringify(response.data.token);
      setAxiosToken(token);
      setCookie("token", token);
    }
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      deleteCookie("token");
      if (typeof window !== "undefined") {
        window.location.replace("/authentication");
      }
    } else if (error.response?.status === 500) {
      //   errorToast(error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
export { setAxiosToken };
