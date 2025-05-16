import { AnimalVaccine } from "./animalVaccine";

export interface AnimalProfile {
    id: number;
    animalName: string;
    birthdate: string;
    sex: string;
    age: number;
    weight: string;
    type: string;
    breed: string;
    vaccines: AnimalVaccine[]
  }