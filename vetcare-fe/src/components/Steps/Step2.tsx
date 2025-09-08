import React from "react";
import { Vaccine } from "@/components/entities/vaccines";
import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";
import styles from "./steps.module.css";
import { SyringeIcon } from "lucide-react";
import { VaccinesList } from "@/components/Vaccines/VaccinesList";
import Swal from "sweetalert2";

interface Props {
   vaccines: Vaccine[];
   formData: CreateAnimalProfile;
   handleVaccineCheck: (
      vaccineId: number,
      dose: "first" | "second",
      checked: boolean
   ) => void;
   handleVaccineDateChange: (
      vaccineId: number,
      dose: "first" | "second",
      date: string
   ) => void;
   setStep: (step: number) => void;
   handleSubmit: () => void;
}

const Step2: React.FC<Props> = ({
                                   vaccines,
                                   formData,
                                   handleVaccineCheck,
                                   handleVaccineDateChange,
                                   setStep,
                                   handleSubmit,
                                }) => {

   const handleStep2Submit = () => {
      for (const vaccine of vaccines.filter(v => v.animalType === formData.type)) {
         const firstDate = formData.vaccineDates.firstDoseDates[vaccine.id];
         const secondDate = formData.vaccineDates.secondDoseDates[vaccine.id];

         if (firstDate && secondDate && new Date(secondDate) < new Date(firstDate)) {
            Swal.fire("Eroare", `Data celei de-a doua doze pentru ${vaccine.name} nu poate fi mai devreme decât prima doză.`, "error");
            return;
         }

         if (!firstDate && secondDate) {
            Swal.fire("Eroare", `Trebuie să selectezi întâi data primei doze pentru ${vaccine.name}.`, "error");
            return;
         }
      }
      handleSubmit();
   }

   return (
      <div>
         <div className={styles.headerContainer}>
            <div className={styles.headerTitle}>
               <SyringeIcon
                  style={{
                     width: "48px",
                     height: "48px",
                     color: "#3640d1",
                     backgroundColor: "#ceddfa",
                     borderRadius: "50%",
                     padding: "10px",
                  }}
               />
               <h3>Vaccinuri efectuate</h3>
            </div>
            <p className={styles.headerSubtitle}>
               Selectează vaccinurile efectuate și introdu datele administrării
            </p>
         </div>

         <VaccinesList
            vaccines={vaccines}
            animalType={formData.type}
            formData={formData}
            handleVaccineCheck={handleVaccineCheck}
            handleVaccineDateChange={handleVaccineDateChange}
         />

         <div className={styles.buttonsContainer}>
            <button onClick={() => setStep(1)} className={styles.btnBack}>
               Înapoi
            </button>

            <button onClick={handleStep2Submit} className={styles.btnSubmit}>
               Trimite
            </button>
         </div>
      </div>
   );
};

export default Step2;
