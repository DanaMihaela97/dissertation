// import { AnimalVaccine } from '@/components/entities/animalVaccine';
// import { CreateAnimalProfile } from '@/components/entities/createAnimalProfile';
// import { Vaccine } from '@/components/entities/vaccines';
// import axios from 'axios';

// const URL = "http://localhost:8060";
// const getAuthHeaders = () => ({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("jwt")}`
//   }
// });

// export const createAnimal = async (animal: any): Promise<any> => {
//   const response = await axios.post(`${URL}/api/animals/`, animal, getAuthHeaders());
//   return response.data;
// };

// export const createAnimalVaccines = async (animalId: number, vaccines: any[]): Promise<any> => {
//   if (!vaccines || vaccines.length === 0) return; 
//   const response = await axios.post(`${URL}/api/animals/${animalId}/vaccines`, vaccines, getAuthHeaders());
//   return response.data;
// };

// export const getAllAnimals = async (): Promise<CreateAnimalProfile[]> => {
//   const response = await axios.get(`${URL}/api/animals/`, getAuthHeaders());
//   return response.data;
// };

// export const getAnimalById = async (animalId: number) : Promise<any> =>{
//    const response = await axios.get(`${URL}/api/animals/${animalId}`, getAuthHeaders());
//   return response.data;
// }

// export const getDogBreeds = async (): Promise<string[]> => {
//   const response = await axios.get(`${URL}/api/animals/dog-breeds`, getAuthHeaders());
//   return response.data;
// };

// export const getCatBreeds = async (): Promise<string[]> => {
//   const response = await axios.get(`${URL}/api/animals/cat-breeds`, getAuthHeaders());
//   return response.data;
// };

// export const getVaccines = async (): Promise<Vaccine[]> => {
//   const response = await axios.get(`${URL}/api/vaccines/`, getAuthHeaders());
//   return response.data;
// }

// export const getAnimalVaccines = async (id: number): Promise<AnimalVaccine[]> => {
//   const response = await axios.get(`${URL}/api/animals/${id}/vaccines`, getAuthHeaders());
//   return response.data;
// }
import { AnimalProfile } from '@/components/entities/animalProfile';
import { AnimalVaccine } from '@/components/entities/animalVaccine';
import { CreateAnimalProfile } from '@/components/entities/createAnimalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import axios from 'axios';

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

export const createAnimal = async (animal: any): Promise<any> => {
  const response = await axios.post(`${URL}/api/animals/`, animal, getAuthHeaders());
  return response.data;
};

export const createAnimalVaccines = async (animalId: number, vaccines: any[]): Promise<any> => {
  if (!vaccines || vaccines.length === 0) return;
  const response = await axios.post(`${URL}/api/animals/${animalId}/vaccines`, vaccines, getAuthHeaders());
  return response.data;
};

export const getAllAnimals = async (): Promise<CreateAnimalProfile[]> => {
  const response = await axios.get(`${URL}/api/animals/`, getAuthHeaders());
  return response.data;
};

export const getAnimalById = async (animalId: number, token?: string): Promise<any> => {
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const response = await axios.get(`${URL}/api/animals/${animalId}`, headers);
  return response.data;
};

export const getDogBreeds = async (): Promise<string[]> => {
  const response = await axios.get(`${URL}/api/animals/dog-breeds`, getAuthHeaders());
  return response.data;
};

export const getCatBreeds = async (): Promise<string[]> => {
  const response = await axios.get(`${URL}/api/animals/cat-breeds`, getAuthHeaders());
  return response.data;
};
export const getVaccines = async (): Promise<Vaccine[]> => {
  const response = await axios.get(`${URL}/api/vaccines/`, getAuthHeaders());
  // Dacă API-ul răspunde cu { data: [...] }
  return response.data.data || response.data;
};

export const getAnimalVaccines = async (id: number): Promise<AnimalVaccine[]> => {
  const response = await axios.get(`${URL}/api/animals/${id}/vaccines`, getAuthHeaders());
  return response.data;
}

// Implement this function to fetch all animal IDs for getStaticPaths
export const getAllAnimalIds = async (): Promise<number[]> => {
  try {
    const response = await axios.get<AnimalProfile[]>(`${URL}/api/animals`, getAuthHeaders());
    const animalIds = response.data.map((animal) => animal.id);
    return animalIds;
  } catch (error) {
    console.error("Error fetching animal IDs:", error);
    return [];
  }
};