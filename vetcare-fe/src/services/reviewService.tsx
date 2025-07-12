import { Review } from "@/components/entities/review";
import axios from "axios";

const URL = "http://localhost:8060";

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
export const createReview = async (review: Omit<Review, "email" | "createdAt">): Promise<Review> => {
  const response = await axios.post(`${URL}/api/reviews`, review, getAuthHeaders());
  return response.data;
};


export const getReviews = async (): Promise<Review[]> => {
  const response = await axios.get(`${URL}/api/reviews`, getAuthHeaders());
  return response.data;
};

export const getReviewMean = async (authToken?: string) => {
  try {
    const headers = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
    const response = await axios.get(`${URL}/api/reviews/mean`, headers);
    return response.data;
  } catch (error) {
    console.error('Error fetching review mean:', error);
    throw error;
  }
};

export const getConsultationCount = async () => {
  try {
    const response = await axios.get(`${URL}/api/chat/count`, getAuthHeaders());
    return response.data; 
  } catch (error) {
    console.error('Error fetching consultation count:', error);
    throw error; 
  }
}
