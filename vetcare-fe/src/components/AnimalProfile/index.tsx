import React from 'react';
import { AnimalProfile } from '../entities/animalProfile';
import { Cake, Cat, Dog, Syringe, Weight } from 'lucide-react';
import styles from "./AnimalProfile.module.css";
import { useRouter } from 'next/router';

const AnimalProfileComponent = ({ animal }: { animal: AnimalProfile }) => {
  const animalIcon =
    animal.type === "Câine" ? (
      <Dog size={40} color="#2c7be5" />
    ) : (
      <Cat size={40} color="#2c7be5" />
    );
 const router = useRouter();

  return (
    <div className={styles.card} onClick={() => router.push(`/animals/${animal.id}`)} style={{ cursor: "pointer" }}>
      <div className={styles.header}>
        {animalIcon}
        <h3 className={styles.title}>{animal.animalName}</h3>
      </div>

      <p className={styles.breed}>{animal.breed}</p>

      <div className={styles.infoRow}>
        <div className={styles.infoItem}>
          <Cake size={20} />
          <p>{animal.age} ani</p>
        </div>

        <div className={styles.infoItem}>
          <Weight size={20} />
          <p>{animal.weight} kg</p>
        </div>
      </div>

      <div className={styles.vaccinesSection}>
        <h4>Vaccinuri administrate:</h4>
        {animal.vaccines.length > 0 ? (
          <ul className={styles.vaccineList}>
            {animal.vaccines.map((vaccine) => (
              <li key={vaccine.vaccineId} className={styles.vaccineItem}>
                <Syringe size={16} />
                {vaccine.vaccineName || "Nume necunoscut"} -{" "}
                {new Date(vaccine.dateAdministered).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noVaccines}>Nu există vaccinuri înregistrate.</p>
        )}
      </div>
    </div>
  );
};

export default AnimalProfileComponent;