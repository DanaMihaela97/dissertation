
import AnimalProfileComponent from '@/components/AnimalProfile';
import { AnimalProfile } from '@/components/entities/animalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import { getAllAnimals, getVaccines } from '@/services/animalService';
import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import Layout from "@/components/Layout";
import Authentication from "@/components/Authentication";
import {useRouter} from "next/router";

const Animals = () => {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);
  const router = useRouter();

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
    <Layout>
      <Authentication>
        <div style={{ padding: '20px' }}>
          <h2>Profiluri animale</h2>
          <div className={styles.container} style={{ marginTop: '50px' }}>
            {animals.map((animal) => (
               <div key={animal.id} className={styles.cardWrapper}>
                 <AnimalProfileComponent animal={animal} />
                 <button className={styles.detailsLink} onClick={() => router.push(`/animals/${animal.id}`)}>
                   Vezi detalii
                 </button>

               </div>
            ))}
          </div>
        </div>
      </Authentication>
    </Layout>
  );

}
export default Animals;