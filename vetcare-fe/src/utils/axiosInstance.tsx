import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
   baseURL: "http://localhost:8060",
});

axiosInstance.interceptors.request.use(
   async (config) => {
      const session = await getSession();
      console.log("Session in interceptor:", session);

      if (session?.accessToken) {
         console.log("AxiosInstance session:", session);
         config.headers = {
            ...config.headers,
            Authorization: `Bearer ${session.accessToken}`,
         };
      }

      return config;
   },
   (error) => Promise.reject(error)
);
export default axiosInstance;
