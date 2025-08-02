import { AnimalProfile } from "@/components/entities/animalProfile";
import axiosInstance from "@/utils/axiosInstance";


const URL = "http://localhost:8060/api/chat";

export const startChat = async (
  animal: AnimalProfile
): Promise<{ message: string; sessionId: string; botResponse: string }> => {
  const response = await axiosInstance.post(`${URL}/start`, animal);
    console.log(response.data)
  return response.data;
};

export const sendMessage = async (
    sessionId: number,
    userMessage: string
): Promise<{ reply: string, finished: boolean}> => {
    const response = await axiosInstance.post(
        `${URL}/send/${sessionId}`,
        userMessage
    );
    console.log(response.data)
    return response.data;
};

export const getConsultationsByAnimalId = async (animalId: number) => {
  const response = await axiosInstance.get(`${URL}/${animalId}`);
  return response.data;  
};
