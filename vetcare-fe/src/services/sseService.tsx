import axios from "axios";

const URL = "http://localhost:8060";
export const SSE_URL = `${URL}/websocket/updates`;

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

export const getUpdates = async (): Promise<string[]> => {
    const response = await axios.get(`${SSE_URL}`, getAuthHeaders());
    return response.data;
};
export function createEventSource() {
    return new EventSource(SSE_URL, { withCredentials: true });
}