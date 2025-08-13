import { Vaccine } from "@/components/entities/vaccines";
import styles from "./Vaccines.module.css";
import { CalendarIcon, ClockIcon } from "lucide-react";

interface Props {
   vaccines: Vaccine[];
   animalType: string;
   formData: any;
   handleVaccineCheck: (name: string, checked: boolean) => void;
   handleVaccineDateChange: (name: string, date: string) => void;
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
               const isChecked = vaccine.name in (formData.vaccineDates || {});

               return (
                  <div
                     key={vaccine.id}
                     className={`${styles.vaccineCard} ${isChecked ? styles.checked : ""}`}
                  >
                     <div className="flex items-start mb-2">
                        <input
                           type="checkbox"
                           checked={isChecked}
                           onChange={(e) =>
                              handleVaccineCheck(vaccine.name, e.target.checked)
                           }
                           id={`vaccine-${vaccine.id}`}
                           className="mt-1"
                        />
                        <label
                           htmlFor={`vaccine-${vaccine.id}`}
                           className="font-semibold cursor-pointer select-none"
                           style={{ marginLeft: '8px' }}
                        >
                           {vaccine.name}
                        </label>
                     </div>

                     {isChecked && (
                        <input
                           type="date"
                           className={styles.dateInput}
                           value={formData.vaccineDates[vaccine.name] || ""}
                           onChange={(e) =>
                              handleVaccineDateChange(vaccine.name, e.target.value)
                           }
                        />
                     )}

                     <div className="flex justify-between mt-2">
                        <div className={styles.infoRow}>
                           <ClockIcon />
                           <span>Vârsta minimă: {vaccine.ageWeeks} săptămâni</span>
                        </div>
                        <div className={styles.infoRow}>
                           <CalendarIcon />
                           <span>Rapel: {vaccine.rapel_days} zile</span>
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
