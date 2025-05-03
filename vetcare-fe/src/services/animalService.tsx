import { Vaccine } from '@/components/entities/vaccines';
import axios from 'axios';

const URL = "http://localhost:8060";

export const getDogBreeds = async (): Promise<string[]> => {
  const token = localStorage.getItem("jwt"); 
  try {
    const response = await axios.get(`${URL}/api/animals/dog-breeds`, {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dog breeds:", error);
    throw error;
  }
};

export const getCatBreeds = async (): Promise<string[]> => {
  const accessToken = localStorage.getItem("jwt");
  try {
    const response = await axios.get(`${URL}/api/animals/cat-breeds`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`  
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching cat breeds:", error);
    throw error;
  }
};

export const getVaccines = async (): Promise<Vaccine[]> => {
  const accessToken = localStorage.getItem("jwt");
  try {
    const response = await axios.get(`${URL}/api/animals/vaccines`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`  
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching vaccines:", error);
    throw error;
  }
};
