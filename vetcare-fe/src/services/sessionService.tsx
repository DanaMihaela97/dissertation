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

export const startChat = async (animal: AnimalProfile): Promise<{ message: string, sessionId: string }> => {
    const response = await axios.post(`${URL}/start`, animal, getAuthHeaders());
    return response.data;
};
export const sendMessage = async (
    sessionId: number,
    userMessage: string
): Promise<{ response: string, [key: string]: any }> => {
    const response = await axios.post(
        `${URL}/send/${sessionId}`,
        userMessage,
        getAuthHeaders()
    );
    return response.data;
};