export interface CreateAnimalProfile {
    animalName: string;
    birthdate: string;
    sex: string;
    age: number;
    weight: string;
    type: string;
    breed: string;
    vaccineDates: Record<string, string>; 
  }