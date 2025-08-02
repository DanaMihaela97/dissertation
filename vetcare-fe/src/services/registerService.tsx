import { Register } from '@/components/entities/register';
import axiosInstance from "@/utils/axiosInstance";


const URL = "http://localhost:8060";

export const register = async (acc: any)=> {
  const response = axiosInstance.post(`${URL}/signUp`, acc) .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
};
