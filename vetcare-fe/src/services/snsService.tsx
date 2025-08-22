import axiosInstance from "@/utils/axiosInstance";

export const subscribeToNotifications = async (email: string): Promise<void> => {
   await axiosInstance.post(`/api/notifications/subscribe`, { email });

};
