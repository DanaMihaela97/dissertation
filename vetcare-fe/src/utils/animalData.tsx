import {CreateAnimalProfile} from "@/components/entities/createAnimalProfile";
import {getCatBreeds, getDogBreeds, getVaccines} from "@/services/animalService";


export function getAgeString(birthdate: string): string {
   const birth = new Date(birthdate);
   const now = new Date();

   let years = now.getFullYear() - birth.getFullYear();
   let months = now.getMonth() - birth.getMonth();
   const days = now.getDate() - birth.getDate();

   if (days < 0) {
      months--;
   }

   if (months < 0) {
      years--;
      months += 12;
   }

   if (years > 0) {
      return `${years} ${years === 1 ? "an" : "ani"}`;
   } else {
      return `${months} ${months === 1 ? "lună" : "luni"}`;
   }
}

export const stringToDate = (str: string | null | undefined): Date | null =>
   str ? new Date(str) : null;

export const dateToString = (date: Date | null): string => {
   if (!date) return "";
   const year = date.getFullYear();
   const month = (date.getMonth() + 1).toString().padStart(2, "0");
   const day = date.getDate().toString().padStart(2, "0");
   return `${year}-${month}-${day}`;
};

export const isStep1Valid = (formData: CreateAnimalProfile): boolean => {
   return (
      formData.animalName !== "" &&
      formData.birthdate !== "" &&
      formData.sex !== "" &&
      formData.weight !== "" &&
      formData.type !== "" &&
      formData.breed !== ""
   );
};

export const calculateAge = (birthDate: string): number => {
   const birth = new Date(birthDate);
   const today = new Date();
   let age = today.getFullYear() - birth.getFullYear();
   if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
   ) {
      age--;
   }
   return age;
};

export const updateVaccineDates = (
   vaccineDates: Record<string, string>,
   vaccineName: string,
   checked: boolean
): Record<string, string> => {
   const updatedDates = { ...vaccineDates };
   if (!checked) {
      delete updatedDates[vaccineName];
   } else {
      updatedDates[vaccineName] = "";
   }
   return updatedDates;
};

export const updateVaccineDate = (
   vaccineDates: Record<string, string>,
   vaccineName: string,
   date: string
): Record<string, string> => ({
   ...vaccineDates,
   [vaccineName]: date,
});

export const buildAnimalPayload = (formData: CreateAnimalProfile) => ({
   animalName: formData.animalName,
   birthdate: formData.birthdate,
   sex: formData.sex,
   age: formData.age,
   weight: formData.weight,
   type: formData.type,
   breed: formData.breed,
});

export async function fetchBreeds(type) {
   if (type === "Câine") {return getDogBreeds();}
   if (type === "Pisică") {return getCatBreeds();}
   return [];
}

export async function fetchVaccines() {
   return getVaccines();
}