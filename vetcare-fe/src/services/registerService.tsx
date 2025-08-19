import axiosInstance from "@/utils/axiosInstance";
import { Register } from "@/components/entities/register";
export const register = async (acc: Register) => {
  try {
    return await axiosInstance.post(`/signUp`, acc);
  } catch (error) {
    throw error;
  }
};
