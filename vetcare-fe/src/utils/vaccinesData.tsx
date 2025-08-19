import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";

export const handleVaccineCheck = (
   setFormData: React.Dispatch<React.SetStateAction<CreateAnimalProfile>>,
   vaccineName: string,
   checked: boolean
) => {
   setFormData((prev) => {
      const newDates = { ...prev.vaccineDates };
      if (!checked) {
         delete newDates[vaccineName];
      } else {
         newDates[vaccineName] = "";
      }
      return { ...prev, vaccineDates: newDates };
   });
};

export const handleVaccineDateChange = (
   setFormData: React.Dispatch<React.SetStateAction<CreateAnimalProfile>>,
   vaccineName: string,
   date: string
) => {
   setFormData((prev) => ({
      ...prev,
      vaccineDates: {
         ...prev.vaccineDates,
         [vaccineName]: date,
      },
   }));
};
