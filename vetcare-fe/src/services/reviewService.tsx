import { Review } from "@/components/entities/review";
import axiosInstance from "@/utils/axiosInstance";


export const createReview = async (review: Omit<Review, "email" | "createdAt">): Promise<Review> => {
  const response = await axiosInstance.post(`/api/reviews/`, review);
  return response.data;
};


export const getReviews = async (): Promise<Review[]> => {
  const response = await axiosInstance.get(`/api/reviews/`);
  return response.data;
};

export const getReviewMean = async () => {
  try {
    const response = await axiosInstance.get(`/api/reviews/mean`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getConsultationCount = async () => {
  try {
    const response = await axiosInstance.get(`/api/chat/count`);
    return response.data; 
  } catch (error) {
    console.error( error);
    throw error; 
  }
}
