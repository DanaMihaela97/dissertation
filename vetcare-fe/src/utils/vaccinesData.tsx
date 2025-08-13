export const handleVaccineCheck = (
   setFormData: React.Dispatch<React.SetStateAction<any>>,
   vaccineName: string,
   checked: boolean
) => {
   setFormData((prev: any) => {
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
   setFormData: React.Dispatch<React.SetStateAction<any>>,
   vaccineName: string,
   date: string
) => {
   setFormData((prev: any) => ({
      ...prev,
      vaccineDates: {
         ...prev.vaccineDates,
         [vaccineName]: date,
      },
   }));
};
