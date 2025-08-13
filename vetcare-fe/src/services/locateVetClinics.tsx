
import axiosInstance from "@/utils/axiosInstance";
import {Clinic} from "@/components/entities/clinic";

export const locateVetClinics = async (address: string): Promise<Clinic[]> => {
   const response = await axiosInstance.post('/api/locate/locateVeterinaryOffices', { address });
   return response.data;
};
