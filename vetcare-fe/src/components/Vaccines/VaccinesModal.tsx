import { useEffect, useState } from "react";
import { Vaccine } from "@/components/entities/vaccines";
import {CreateAnimalProfile} from "@/components/entities/createAnimalProfile";
import { getVaccines, updateAnimalVaccines} from "@/services/animalService";
import styles from "./Vaccines.module.css";
import { VaccinesList } from "@/components/Vaccines/VaccinesList";
import {handleVaccineCheck, handleVaccineDateChange} from "@/utils/vaccinesData";
import Swal from "sweetalert2";
import {AnimalVaccine} from "@/components/entities/animalVaccine";

interface Props {
   animalType: string;
   animalId: number;
   animalVaccines: AnimalVaccine[];
   onClose: () => void;
   onSave?: (updatedVaccines: AnimalVaccine[]) => void;
}

export const VaccinesModal: React.FC<Props> = ({
                                                  animalType,
                                                  animalId,
                                                  animalVaccines,
                                                  onClose,
                                                  onSave,
                                               }) => {
   const [vaccines, setVaccines] = useState<Vaccine[]>([]);
   const [formData, setFormData] = useState<{ vaccineDates: Record<string, string> }>({
      vaccineDates: {},
   });

   useEffect(() => {
      getVaccines().then(setVaccines);
   }, []);

   useEffect(() => {
      const datesMap: Record<string, string> = {};
      animalVaccines.forEach((av) => {

         const vac = vaccines.find((v) => v.id === av.vaccineId);
         if (vac && av.dateAdministered) {
            datesMap[vac.name] = av.dateAdministered;
         }
      });
      setFormData({ vaccineDates: datesMap });
   }, [animalVaccines, vaccines]);

   const handleVaccineCheckWrapper = (vaccineName: string, checked: boolean) => {
      handleVaccineCheck(setFormData, vaccineName, checked);
   };

   const handleVaccineDateChangeWrapper = (vaccineName: string, date: string) => {
      handleVaccineDateChange(setFormData, vaccineName, date);
   };

   const handleUpdateVaccines = async () => {
      try {
         const selectedVaccines = Object.entries(formData.vaccineDates)
         .filter(([ date]) => date !== "")
         .map(([vaccineName, date]) => {
            const vaccine = vaccines.find(v => v.name === vaccineName);
            if (!vaccine) {
               return null;
            }
            return {
               animalId: animalId,
               vaccineId: vaccine.id,
               dateAdministered: date,
               nextDose: null,
            };
         })
         .filter((vaccine) => vaccine !== null) as AnimalVaccine[];

         const updatedVaccines = await updateAnimalVaccines(animalId, selectedVaccines);

         if (onSave) onSave(updatedVaccines);

         Swal.fire({
            title: "Vaccinuri actualizate!",
            text: `Lista de vaccinuri a fost actualizată cu succes!`,
            icon: "success",
         });

         onClose();
      } catch (error) {
         console.error(error);
         Swal.fire({
            title: "Eroare!",
            text: "A apărut o eroare la actualizarea vaccinurilor.",
            icon: "error",
         });
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
            <VaccinesList
               vaccines={vaccines}
               animalType={animalType}
               formData={animalProfile}
               handleVaccineCheck={handleVaccineCheckWrapper}
               handleVaccineDateChange={handleVaccineDateChangeWrapper}
            />
            <div className={styles.modalActions}>
               <button onClick={handleUpdateVaccines} className={styles.saveButton}>
                  Salvează
               </button>
               <button onClick={onClose} className={styles.cancelButton}>
                  Închide
               </button>
            </div>
         </div>
      </div>
   );
};