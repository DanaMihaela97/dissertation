import { Review } from "@/components/entities/review";
import axiosInstance from "@/utils/axiosInstance";

const URL = "http://localhost:8060";

export const createReview = async (review: Omit<Review, "email" | "createdAt">): Promise<Review> => {
  const response = await axiosInstance.post(`${URL}/api/reviews/`, review);
  return response.data;
};


export const getReviews = async (): Promise<Review[]> => {
  const response = await axiosInstance.get(`${URL}/api/reviews/`);
  return response.data;
};

export const getReviewMean = async () => {
  try {
    const response = await axiosInstance.get(`${URL}/api/reviews/mean`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review mean:', error);
    throw error;
  }
};

export const getConsultationCount = async () => {
  try {
    const response = await axiosInstance.get(`${URL}/api/chat/count`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching consultation count:', error);
    throw error; 
  }
}
