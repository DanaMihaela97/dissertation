import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";
import { Vaccine } from "@/components/entities/vaccines";
import axios from "axios";

const URL = "http://localhost:8060";
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});

export const createAnimal = async (animal: unknown): Promise<unknown> => {
  const response = await axios.post(
    `${URL}/api/animals/`,
    animal,
    getAuthHeaders()
  );
  return response.data;
};

export const createAnimalVaccines = async (
  animalId: number,
  vaccines: unknown[]
): Promise<unknown> => {
  if (!vaccines || vaccines.length === 0) return;
  const response = await axios.post(
    `${URL}/api/animals/${animalId}/vaccines`,
    vaccines,
    getAuthHeaders()
  );
  return response.data;
};
export const getAllAnimals = async (): Promise<CreateAnimalProfile[]> => {
  const response = await axios.get(`${URL}/api/animals/`, getAuthHeaders());
  return response.data;
};

export const getDogBreeds = async (): Promise<string[]> => {
  const response = await axios.get(
    `${URL}/api/animals/dog-breeds`,
    getAuthHeaders()
  );
  return response.data;
};

export const getCatBreeds = async (): Promise<string[]> => {
  const response = await axios.get(
    `${URL}/api/animals/cat-breeds`,
    getAuthHeaders()
  );
  return response.data;
};

export const getVaccines = async (): Promise<Vaccine[]> => {
  const response = await axios.get(`${URL}/api/vaccines/`, getAuthHeaders());
  return response.data;
};
