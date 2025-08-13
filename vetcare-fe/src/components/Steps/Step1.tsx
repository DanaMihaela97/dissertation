import {Calendar, HeartIcon, PawPrint, WeightIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import { MoonLoader } from "react-spinners";
import styles from './steps.module.css';
import {CreateAnimalProfile} from "@/components/entities/createAnimalProfile";

type Step1Props = {
   formData: CreateAnimalProfile;
   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
   handleSelectChange: (name: string, value: string) => void;
   setFieldValue: (name: string, value: string) => void;
   stringToDate: (dateStr: string) => Date | null;
   dateToString: (date: Date) => string;
   datePickerRef: React.RefObject<any>;
   breeds: string[];
   loadingBreeds: boolean;
   setStep: (step: number) => void;
   isStep1Valid: (formData: any) => boolean;
};

export const Step1: React.FC<Step1Props> = ({
                                        formData,
                                        handleChange,
                                        handleSelectChange,
                                        setFieldValue,
                                        stringToDate,
                                        dateToString,
                                        datePickerRef,
                                        breeds,
                                        loadingBreeds,
                                        setStep,
                                        isStep1Valid,
                                     }) => {
   return (
      <>
         <div className={styles.headerContainer}>
            <div className={styles.headerTitle}>
               <PawPrint
                  style={{
                     width: "48px",
                     height: "48px",
                     color: "#3640d1",
                     backgroundColor: "#ceddfa",
                     borderRadius: "50%",
                     padding: "10px",
                     marginRight: "12px",
                  }}
               />
               <h2 className="text-3xl font-bold text-gray-900">Informații despre animal</h2>
            </div>
         </div>

         <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
               <label htmlFor="animalName">
                  <PawPrint className={styles.icons} />
                  Nume animal<span className={styles.requiredIcon}> *</span>
               </label>
               <input
                  id="animalName"
                  name="animalName"
                  value={formData.animalName}
                  placeholder="Nume animal"
                  onChange={handleChange}
                  required
               />
            </div>

            <div className={styles.inputGroup} style={{ position: "relative" }}>
               <label htmlFor="birthdate">
                  <Calendar className={styles.icons} />
                  Data nașterii
                  <span className={styles.requiredIcon}> *</span>
               </label>
               <DatePicker
                  id="birthdate"
                  ref={datePickerRef}
                  selected={stringToDate(formData.birthdate)}
                  onChange={(date: Date) => {
                     if (date) {
                        setFieldValue("birthdate", dateToString(date));
                     }
                  }}
                  onChangeRaw={(e) => {
                     if (!e) return;
                     const input = e.target as HTMLInputElement;
                     const rawValue = input.value;

                     const parsed = new Date(rawValue);
                     if (!isNaN(parsed.getTime())) {
                        setFieldValue("birthdate", dateToString(parsed));
                     }
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="yyyy-MM-dd (ex: 2020-12-25)"
                  maxDate={new Date()}
                  calendarClassName={styles.customCalendar}
               />
               <Calendar
                  onClick={() => datePickerRef.current.setOpen(true)}
                  size={20}
                  style={{ position: "absolute", right: 10, top: "57%", cursor: "pointer", color: "#666" }}
               />
            </div>

            <div className={styles.inputGroup}>
               <label htmlFor="sex">
                  <HeartIcon className={styles.icons} />
                  Sex
                  <span className={styles.requiredIcon}> *</span>
               </label>
               <select
                  value={formData.sex}
                  onChange={(e) => handleSelectChange("sex", e.target.value)}
               >
                  <option value="">Alege</option>
                  <option value="Mascul">Mascul</option>
                  <option value="Femelă">Femelă</option>
               </select>
            </div>

            <div className={styles.inputGroup}>
               <label htmlFor="weight">
                  <WeightIcon className={styles.icons} />
                  Greutate (kg)
                  <span className={styles.requiredIcon}> *</span>
               </label>
               <input
                  id="weight"
                  name="weight"
                  type="text"
                  value={formData.weight}
                  placeholder="Greutate"
                  onChange={handleChange}
               />
            </div>

            <div className={styles.inputGroup}>
               <label htmlFor="type">
                  <PawPrint className={styles.icons} />
                  Tip animal
                  <span className={styles.requiredIcon}> *</span>
               </label>
               <select
                  value={formData.type}
                  onChange={(e) => handleSelectChange("type", e.target.value)}
               >
                  <option value="">Alege</option>
                  <option value="Câine">Câine</option>
                  <option value="Pisică">Pisică</option>
               </select>
            </div>

            <div className={styles.inputGroup}>
               <label htmlFor="breed">
                  <PawPrint className={styles.icons} />
                  Rasă
                  <span className={styles.requiredIcon}> *</span>
               </label>
               {loadingBreeds ? (
                  <div className="flex justify-center items-center h-[40px]">
                     <MoonLoader color="#2563eb" size={24} />
                  </div>
               ) : (
                  <select
                     value={formData.breed}
                     onChange={(e) => handleSelectChange("breed", e.target.value)}
                     disabled={!formData.type}
                     className="w-full rounded-md border px-3 py-2 focus:outline-none"
                     style={{
                        backgroundColor: !formData.type ? "#e5e7eb" : "#fff",
                        color: !formData.type ? "#9ca3af" : "#111827",
                        cursor: !formData.type ? "not-allowed" : "pointer",
                     }}
                  >
                     <option value="">Selectează rasa</option>
                     {breeds.map((breed) => (
                        <option key={breed} value={breed}>
                           {breed}
                        </option>
                     ))}
                  </select>
               )}
            </div>

            <div className={styles.buttonWrapper}>
               <button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid(formData)}
                  className={styles.continueButton}
               >
                  Continuă către vaccinuri
               </button>
            </div>
         </div>
      </>
   );
};
