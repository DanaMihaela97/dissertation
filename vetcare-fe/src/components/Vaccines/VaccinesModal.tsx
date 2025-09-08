import { useState, useEffect } from "react";
import { Vaccine } from "@/components/entities/vaccines";
import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";
import { getVaccines, updateAnimalVaccines } from "@/services/animalService";
import styles from "./Vaccines.module.css";
import { VaccinesList } from "@/components/Vaccines/VaccinesList";
import { AnimalVaccine } from "@/components/entities/animalVaccine";
import Swal from "sweetalert2";

interface Props {
   animalType: string;
   animalId: number;
   animalVaccines: AnimalVaccine[];
   onClose: () => void;
   onSave?: (updatedVaccines: AnimalVaccine[]) => void;
}

interface VaccineDates {
   firstDoseDates: Record<number, string>;
   secondDoseDates: Record<number, string>;
}

export const VaccinesModal: React.FC<Props> = ({
                                                  animalType,
                                                  animalId,
                                                  animalVaccines,
                                                  onClose,
                                                  onSave,
                                               }) => {
   const [vaccines, setVaccines] = useState<Vaccine[]>([]);
   const [formData, setFormData] = useState<{ vaccineDates: VaccineDates }>({
      vaccineDates: {
         firstDoseDates: {},
         secondDoseDates: {},
      },
   });

   const [errorMessage, setErrorMessage] = useState<string>("");

   useEffect(() => {
      getVaccines().then(setVaccines);
   }, []);

   useEffect(() => {
      const firstDoseDates: Record<number, string> = {};
      const secondDoseDates: Record<number, string> = {};

      animalVaccines.forEach((av) => {
         if (av.firstDoseDate) firstDoseDates[av.vaccineId] = av.firstDoseDate;
         if (av.secondDoseDate) secondDoseDates[av.vaccineId] = av.secondDoseDate;
      });

      setFormData({ vaccineDates: { firstDoseDates, secondDoseDates } });
   }, [animalVaccines, vaccines]);

   const handleVaccineCheckWrapper = (
      vaccineId: number,
      dose: "first" | "second",
      checked: boolean
   ) => {
      setFormData((prev) => ({
         vaccineDates: {
            ...prev.vaccineDates,
            [`${dose}DoseDates`]: {
               ...prev.vaccineDates[`${dose}DoseDates`] || {},
               [vaccineId]: checked
                  ? prev.vaccineDates[`${dose}DoseDates`]?.[vaccineId] ||
                  new Date().toISOString().split("T")[0]
                  : "",
            },
         },
      }));
      setErrorMessage("");
   };

   const handleVaccineDateChangeWrapper = (
      vaccineId: number,
      dose: "first" | "second",
      date: string
   ) => {
      setFormData((prev) => ({
         vaccineDates: {
            ...prev.vaccineDates,
            [`${dose}DoseDates`]: {
               ...prev.vaccineDates[`${dose}DoseDates`] || {},
               [vaccineId]: date,
            },
         },
      }));
      setErrorMessage("");
   };

   const handleUpdateVaccines = async () => {

      for (const vaccine of vaccines.filter((v) => v.animalType === animalType)) {
         const firstDate = formData.vaccineDates.firstDoseDates[vaccine.id];
         const secondDate = formData.vaccineDates.secondDoseDates[vaccine.id];

         if (firstDate && secondDate && new Date(secondDate) < new Date(firstDate)) {
            setErrorMessage(
               `Data celei de-a doua doze pentru ${vaccine.name} nu poate fi mai devreme decât prima doză.`
            );
            return;
         }

         if (!firstDate && secondDate) {
            setErrorMessage(
               `Trebuie să selectezi întâi data primei doze pentru ${vaccine.name}.`
            );
            return;
         }
      }

      try {
         const selectedVaccines: AnimalVaccine[] = vaccines
         .map((vaccine) => {
            const firstDose = formData.vaccineDates.firstDoseDates?.[vaccine.id] || null;
            const secondDose = formData.vaccineDates.secondDoseDates?.[vaccine.id] || null;

            if (!firstDose && !secondDose) return null;

            return {
               animalId,
               vaccineId: vaccine.id,
               vaccineName: vaccine.name,
               firstDoseDate: firstDose,
               secondDoseDate: secondDose,
               nextDose: null,
            };
         })
         .filter(Boolean) as AnimalVaccine[];

         const updatedVaccines = await updateAnimalVaccines(animalId, selectedVaccines);

         if (onSave) onSave(updatedVaccines);

         Swal.fire({
            title: "Vaccinuri actualizate!",
            text: "Lista de vaccinuri a fost actualizată cu succes!",
            icon: "success",
         });

         onClose();
      } catch (error) {
         console.error(error);
         setErrorMessage("A apărut o eroare la actualizarea vaccinurilor.");
      }
   };

   const animalProfile: CreateAnimalProfile = {
      id: animalId,
      animalName: "",
      birthdate: "",
      sex: "",
      age: 0,
      weight: "",
      type: animalType,
      breed: "",
      vaccines: animalVaccines,
      vaccineDates: formData.vaccineDates,
   };

   return (
      <div className={styles.modalOverlay}>
         <div className={styles.modalContent}>
            <h2>Selectează vaccinuri</h2>

            <div className={styles.modalBody}>
               <VaccinesList
                  vaccines={vaccines}
                  animalType={animalType}
                  formData={animalProfile}
                  handleVaccineCheck={handleVaccineCheckWrapper}
                  handleVaccineDateChange={handleVaccineDateChangeWrapper}
               />
            </div>

            <div className={styles.modalActions}>
               <button onClick={handleUpdateVaccines} className={styles.saveButton}>
                  Salvează
               </button>
               <button onClick={onClose} className={styles.cancelButton}>
                  Închide
               </button>
            </div>

            {errorMessage && (
               <div
                  style={{
                     marginTop: "12px",
                     padding: "8px",
                     backgroundColor: "#ffe5e5",
                     border: "1px solid #ff4d4f",
                     borderRadius: "4px",
                     color: "#ff1a1a",
                     fontSize: "14px",
                     textAlign: "center",
                  }}
               >
                  {errorMessage}
               </div>
            )}
         </div>
      </div>
   );
};
