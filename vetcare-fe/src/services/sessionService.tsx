import { AnimalProfile } from "@/components/entities/animalProfile";
import axios from "axios";

const URL = "http://localhost:8060/api/chat";

const getAuthHeaders = () => {
    if (typeof window !== 'undefined') {
        const jwtToken = localStorage.getItem("jwt");
        console.log("JWT Token from localStorage:", jwtToken);
        return {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        };
    }
    return { headers: {} };
};

export const startChat = async (
  animal: AnimalProfile
): Promise<{ message: string; sessionId: string; botResponse: string }> => {
  const response = await axios.post(`${URL}/start`, animal, getAuthHeaders());
    console.log(response.data)
  return response.data;
};

export const sendMessage = async (
    sessionId: number,
    userMessage: string
): Promise<{ reply: string, finished: boolean}> => {
    const response = await axios.post(
        `${URL}/send/${sessionId}`,
        userMessage,
        getAuthHeaders()
    );
    console.log(response.data)
    return response.data;
};

export const getConsultationsByAnimalId = async (animalId: number) => {
  const response = await axios.get(`${URL}/${animalId}`, getAuthHeaders());
  return response.data;  
};
