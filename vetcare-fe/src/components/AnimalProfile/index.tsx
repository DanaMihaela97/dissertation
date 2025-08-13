import React from 'react';
import { AnimalProfile } from '../entities/animalProfile';
import { Cake, Cat, Dog, Weight } from 'lucide-react';
import styles from "./AnimalProfile.module.css";
import { useRouter } from 'next/router';
import { getAgeString } from "@/utils/animalData";

const AnimalProfileComponent = ({ animal }: { animal: AnimalProfile }) => {
   const router = useRouter();

   const isDog = animal.type === "Câine";
   const typeColor = isDog ? "#2c7be5" : "#f97316";

   return (
      <div className={styles.card}>
         <div className={styles.header}>
            <div
               className={styles.animalIcon}
               style={{ backgroundColor: typeColor + "22" }}
            >
               {isDog ? <Dog size={30} color={typeColor} /> : <Cat size={30} color={typeColor} />}
            </div>
            <div className={styles.nameBreed}>
               <h3 className={styles.title}>{animal.animalName}</h3>
               <span
                  className={styles.breedBadge}
                  style={{ backgroundColor: typeColor + "22", color: typeColor }}
               >
            {animal.breed}
          </span>
            </div>
         </div>

         <div className={styles.infoCards}>
            <div className={`${styles.infoCard} ${styles.age}`}>
               <Cake size={20} color="#f97316" />
               <span>{getAgeString(animal.birthdate)}</span>
            </div>
            <div className={`${styles.infoCard} ${styles.weight}`}>
               <Weight size={20} color="#16a34a" />
               <span>{animal.weight} kg</span>
            </div>
         </div>

         <button className={styles.detailsButton} onClick={() => router.push(`/animals/${animal.id}`)}>
            Vezi detalii complete
         </button>
      </div>
   );
};

export default AnimalProfileComponent;