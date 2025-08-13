import axiosInstance from "@/utils/axiosInstance";

export const register = async (acc: any) => {
  try {
    return await axiosInstance.post(`/signUp`, acc);
  } catch (error) {
    throw error;
  }
};
