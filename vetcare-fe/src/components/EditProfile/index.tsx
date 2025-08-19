import React from "react";
import styles from "./EditProfileModal.module.css";

type EditProfileModalProps = {
   isOpen: boolean;
   formData: AnimalProfile;
   breeds: string[];
   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
   onSave: () => void;
   onClose: () => void;
};

export default function Index({
                                            isOpen,
                                            formData,
                                            breeds,
                                            onChange,
                                            onSave,
                                            onClose,
                                         }: EditProfileModalProps) {
   if (!isOpen) return null;

   return (
      <div className={styles.modalOverlay}>
         <div className={styles.modalContent}>
            <h2>Editează profilul</h2>
            {formData && (
               <>
                  <b>Nume</b>
                  <input
                     type="text"
                     name="animalName"
                     value={formData.animalName}
                     onChange={onChange}
                     className={styles.modalInput}
                     placeholder="Nume animal"
                  />

                  <b>Rasa</b>
                  <select
                     name="breed"
                     value={formData.breed}
                     onChange={onChange}
                     className={styles.modalSelect}
                  >
                     <option value="">Selectează rasa</option>
                     {breeds.map((b) => (
                        <option key={b} value={b}>
                           {b}
                        </option>
                     ))}
                  </select>

                  <b>Sex</b>
                  <select
                     name="sex"
                     value={formData.sex}
                     onChange={onChange}
                     className={styles.modalSelect}
                  >
                     <option value="Mascul">Mascul</option>
                     <option value="Femelă">Femelă</option>
                  </select>

                  <b>Greutate</b>
                  <input
                     type="text"
                     name="weight"
                     value={formData.weight}
                     onChange={onChange}
                     className={styles.modalInput}
                     placeholder="Greutate (kg)"
                  />

                  <b>Tip</b>
                  <select
                     name="type"
                     value={formData.type}
                     onChange={onChange}
                     className={styles.modalSelect}
                  >
                     <option value="Câine">Câine</option>
                     <option value="Pisică">Pisică</option>
                  </select>

                  <b>Data de naștere</b>
                  <input
                     type="date"
                     name="birthdate"
                     value={formData.birthdate ? formData.birthdate.split("T")[0] : ""}
                     onChange={onChange}
                     className={styles.modalInput}
                     max={new Date().toISOString().split("T")[0]}
                  />

                  <div className={styles.modalActions}>
                     <button className={styles.saveButton} onClick={onSave}>
                        Salvează
                     </button>
                     <button className={styles.cancelButton} onClick={onClose}>
                        Anulează
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
