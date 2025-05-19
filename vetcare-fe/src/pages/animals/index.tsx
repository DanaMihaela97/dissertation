
import AnimalProfileComponent from '@/components/AnimalProfile/AnimalProfileComponent';
import { AnimalProfile } from '@/components/entities/animalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import Navbar from '@/components/Navbar';
import { getAllAnimals, getVaccines } from '@/services/animalService';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';

const Animals = () => {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsResult, vaccinesResult] = await Promise.all([
          getAllAnimals(),
          getVaccines(),
        ]);

        const vaccineNameMap: Record<number, string> = {};
        vaccinesResult.forEach((vaccine: Vaccine) => {
          if (vaccine.id && vaccine.name) {
            vaccineNameMap[vaccine.id] = vaccine.name;
          }
        });

        const animalsWithVaccines = animalsResult.map((animal) => ({
          ...animal,
          vaccines: (animal.vaccines || []).map((v) => ({
            ...v,
            vaccineName: vaccineNameMap[v.vaccineId] || undefined,
          })),
        }));

        setAnimals(animalsWithVaccines);
      } catch (error) {
        console.error('Eroare la preluarea datelor:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Profiluri animale</h2>
        <div className={styles.container} style={{ marginTop: '50px' }}>
          {animals.map((animal) => (
            <div key={animal.id} className={styles.cardWrapper}>
              <AnimalProfileComponent animal={animal} />
              <Link href={`/animals/${animal.id}`} className={styles.detailsLink}>
                Vezi detalii
              </Link>

            </div>
          ))}
        </div>
      </div>
    </>
  );

}
export default Animals;