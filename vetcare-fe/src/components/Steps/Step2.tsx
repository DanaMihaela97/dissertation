import React from "react";
import { Vaccine } from "@/components/entities/vaccines";
import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";
import styles from "./steps.module.css";
import {SyringeIcon} from "lucide-react";
import {VaccinesList} from "@/components/Vaccines/VaccinesList";

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

            <button onClick={handleSubmit} className={styles.btnSubmit}>
               Trimite
            </button>
         </div>
      </div>
   );
};

export default Step2;
