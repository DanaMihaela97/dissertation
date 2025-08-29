import { Vaccine } from "@/components/entities/vaccines";
import styles from "./Vaccines.module.css";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { CreateAnimalProfile } from "@/components/entities/createAnimalProfile";

interface Props {
   vaccines: Vaccine[];
   animalType: string;
   formData: CreateAnimalProfile;
   handleVaccineCheck: (vaccineId: number, dose: "first" | "second", checked: boolean) => void;
   handleVaccineDateChange: (vaccineId: number, dose: "first" | "second", date: string) => void;
}

export const VaccinesList: React.FC<Props> = ({
                                                 vaccines,
                                                 animalType,
                                                 formData,
                                                 handleVaccineCheck,
                                                 handleVaccineDateChange,
                                              }) => {
   return (
      <div className={styles.vaccineGrid}>
         {vaccines.length > 0 ? (
            vaccines
            .filter((vaccine) => vaccine.animalType === animalType)
            .map((vaccine) => {
               const isChecked =
                  !!formData.vaccineDates.firstDoseDates[vaccine.id] ||
                  !!formData.vaccineDates.secondDoseDates[vaccine.id];

               return (
                  <div
                     key={vaccine.id}
                     className={`${styles.vaccineCard} ${isChecked ? styles.checked : ""}`}
                  >
                     <h4 className={styles.vaccineName}>{vaccine.name}</h4>
                     <div className="flex items-center gap-4 mb-2">
                        <div>
                           <input
                              type="checkbox"
                              id={`first-${vaccine.id}`}
                              checked={!!formData.vaccineDates.firstDoseDates[vaccine.id]}
                              onChange={(e) =>
                                 handleVaccineCheck(vaccine.id, "first", e.target.checked)
                              }
                           />
                           <label htmlFor={`first-${vaccine.id}`} className="ml-2">
                              Prima doză
                           </label>
                        </div>

                        <div>
                           <input
                              type="checkbox"
                              id={`second-${vaccine.id}`}
                              checked={!!formData.vaccineDates.secondDoseDates[vaccine.id]}
                              onChange={(e) =>
                                 handleVaccineCheck(vaccine.id, "second", e.target.checked)
                              }
                           />
                           <label htmlFor={`second-${vaccine.id}`} className="ml-2">
                              A doua doză
                           </label>
                        </div>

                     </div>

                     {formData.vaccineDates.firstDoseDates[vaccine.id] && (
                        <input
                           type="date"
                           value={formData.vaccineDates.firstDoseDates[vaccine.id] || ""}
                           onChange={(e) =>
                              handleVaccineDateChange(vaccine.id, "first", e.target.value)
                           }
                           className={styles.dateInput}
                        />
                     )}

                     {formData.vaccineDates.secondDoseDates[vaccine.id] && (
                        <input
                           type="date"
                           value={formData.vaccineDates.secondDoseDates[vaccine.id] || ""}
                           onChange={(e) =>
                              handleVaccineDateChange(vaccine.id, "second", e.target.value)
                           }
                           className={styles.dateInput}
                        />
                     )}

                     <div className="flex justify-between mt-2">
                        <div className={styles.infoRow}>
                           <ClockIcon />
                           <span>Vârsta minimă: {vaccine.ageWeeks} săptămâni</span>
                        </div>
                        <div className={styles.infoRow}>
                           <CalendarIcon />
                           <span>Rapel: {vaccine.rapelDays} zile</span>
                        </div>
                     </div>
                  </div>
               );
            })
         ) : (
            <p className="col-span-full text-center text-gray-500">
               Nu sunt vaccinuri disponibile
            </p>
         )}
      </div>
   );
};
