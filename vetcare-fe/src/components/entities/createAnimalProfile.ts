import { AnimalVaccine } from "./animalVaccine";

export interface CreateAnimalProfile {
  id: number,
    animalName: string;
    birthdate: string;
    sex: string;
    age: number;
    weight: string;
    type: string;
    breed: string;
    vaccineDates: {
      firstDoseDates: Record<number, string>;
      secondDoseDates: Record<number, string>;
    };

  vaccines: AnimalVaccine[];
  }