import axios from "axios";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

interface MySession extends Session {
   accessToken?: string;
}

const axiosInstance = axios.create({
   baseURL: "http://localhost:8060",
});

axiosInstance.interceptors.request.use(
   async (config) => {
      const session = (await getSession()) as MySession;

      if (session?.accessToken) {
         if (!config.headers) {
            config.headers = new axios.AxiosHeaders();
         } else if (!(config.headers instanceof axios.AxiosHeaders)) {
            config.headers = new axios.AxiosHeaders(config.headers);
         }
         config.headers.set("Authorization", `Bearer ${session.accessToken}`);
      }

      return config;
   },
   (error) => Promise.reject(error)
);

export default axiosInstance;
