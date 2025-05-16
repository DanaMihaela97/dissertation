import { Register } from '@/components/entities/register';
import axios from 'axios';

const URL = "http://localhost:8060";

export const register = async (acc: any)=> {
  const response = axios.post(`${URL}/signUp`, acc) .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
};
