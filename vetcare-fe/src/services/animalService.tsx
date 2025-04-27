import { Vaccine } from '@/components/entities/vaccines';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const URL = "http://localhost:8060";
// Funcție pentru a obține rasele de câini
export const getDogBreeds = async (): Promise<string[]> => {
  const token = localStorage.getItem("jwt"); // Preia tokenul din localStorage
  try {
    const response = await axios.get(`${URL}/dog-breeds`, {
      headers: {
        Authorization: `Bearer ${token}`  // Adaugă tokenul în antet
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dog breeds:", error);
    throw error;
  }
};

// Funcție pentru a obține rasele de pisici
export const getCatBreeds = async (): Promise<string[]> => {
  const token = localStorage.getItem("jwt"); // Preia tokenul din localStorage
  try {
    const response = await axios.get(`${URL}/cat-breeds`, {
      headers: {
        Authorization: `Bearer ${token}`  // Adaugă tokenul în antet
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cat breeds:", error);
    throw error;
  }
};

// Funcție pentru a obține vaccinuri
export const getVaccines = async (): Promise<Vaccine[]> => {
  const accessToken = localStorage.getItem("jwt");
  try {
    const response = await axios.get(`${URL}/api/animals/vaccines`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`  // Adaugă tokenul în antet
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
