
import {AnimalProfile} from '@/components/entities/animalProfile';
import {AnimalVaccine} from '@/components/entities/animalVaccine';
import {CreateAnimalProfile} from '@/components/entities/createAnimalProfile';
import {Vaccine} from '@/components/entities/vaccines';
import axiosInstance from "@/utils/axiosInstance";

export const createAnimal = async (animal: any): Promise<any> => {
   const response = await axiosInstance.post(`/api/animals/`, animal);
   return response.data;
};

export const updateAnimal = async (id: number, animal: any): Promise<any> => {
   const response = await axiosInstance.put(`/api/animals/${id}`, animal);
   return response.data;
};

export const updateAnimalVaccines = async (
   animalId: number,
   vaccines: AnimalVaccine[]
): Promise<AnimalVaccine[]> => {
   const response = await axiosInstance.put(`/api/animals/${animalId}/vaccines`, vaccines);
   return response.data;
};

export const createAnimalVaccines = async (animalId: number, vaccines: any[]): Promise<any> => {
   if (!vaccines || vaccines.length === 0) return;
   const response = await axiosInstance.post(`/api/animals/${animalId}/vaccines`, vaccines);
   return response.data;
};

export const getAllAnimals = async (): Promise<CreateAnimalProfile[]> => {
   const response = await axiosInstance.get(`/api/animals/`);
   return response.data;
};

export const deleteAnimal = async (id: number): Promise<void> => {
   await axiosInstance.delete(`/api/animals/${id}`);
};

export const deleteAnimalVaccine = async (animalId: number, vaccineId: number): Promise<void> => {
   await axiosInstance.delete(`/api/animals/${animalId}/vaccines/${vaccineId}`);
};


export const getAnimalByIdWithToken = async (animalId: number, token?: string): Promise<AnimalProfile> => {
   const headers = {headers: {Authorization: `Bearer ${token}`}};

   const response = await axiosInstance.get(`/api/animals/${animalId}`, headers);
   return response.data;
};

export const getAnimalById = async (animalId: number): Promise<AnimalProfile> => {
   const response = await axiosInstance.get(`/api/animals/${animalId}`);
   return response.data;
};

export const getDogBreeds = async (): Promise<string[]> => {
   const response = await axiosInstance.get(`/api/animals/dog-breeds`);
   return response.data;
};

export const getCatBreeds = async (): Promise<string[]> => {
   const response = await axiosInstance.get(`/api/animals/cat-breeds`);
   return response.data;
};

export const getVaccines = async (): Promise<Vaccine[]> => {
   const response = await axiosInstance.get(`/api/vaccines/`);
   return response.data.data || response.data;
};


export const getAnimalCount = async () => {
   try {
      const response = await axiosInstance.get(`/api/animals/count`);
      return response.data;
   } catch (error) {
      console.error(error);
      throw error;
   }
}

