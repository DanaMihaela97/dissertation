import AnimalProfileComponent from '@/components/AnimalProfile';
import { AnimalProfile } from '@/components/entities/animalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import { getAllAnimals, getVaccines, deleteAnimal } from '@/services/animalService';
import React, { useEffect, useState } from 'react';
import styles from './PerAnimal.module.css';
import Layout from "@/components/Layout";
import Authentication from "@/components/Authentication";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react";

const Animals = () => {
  const [animals, setAnimals] = useState<AnimalProfile[]>([]);
  const router = useRouter();
  const { status } = useSession(); // "loading" | "authenticated" | "unauthenticated"

  useEffect(() => {
    if (status === 'unauthenticated')
    {

    }
    if (status !== "authenticated") return;

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
  }, [status]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      text: "Esti sigur ca doresti sa stergi acest animal?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Da, șterge!',
      cancelButtonText: 'Anulează'
    });

    if (result.isConfirmed) {
      try {
        await deleteAnimal(id);
        setAnimals((prev) => prev.filter((animal) => animal.id !== id));

        Swal.fire(
           'Șters!',
           'Animalul a fost șters cu succes.',
           'success'
        );
      } catch (error) {
        console.error("Eroare la ștergerea animalului:", error);
        Swal.fire(
           'Eroare',
           'Ștergerea a eșuat.',
           'error'
        );
      }
    }
  };

  if (status === "loading") {
    return (
       <Layout>
         <p>Se verifică autentificarea...</p>
       </Layout>
    );
  }

  return (
     <Layout>
       <Authentication>
         <div>
           <h2 className="h2Title">Profiluri animale</h2>

           {animals.length === 0 ? (
              <div className={styles.noAnimals}>
                <p className={styles.noPrfMsg}>Nu ai niciun profil de animal creat.</p>
                <button
                   className={styles.createPrf}
                   onClick={() => router.push("/create-animal")}
                >
                  Creează un profil de animal
                </button>
              </div>
           ) : (
              <div className={styles.container} style={{ marginTop: "50px" }}>
                {animals.map((animal) => (
                   <div key={animal.id} className={styles.cardWrapper}>
                     <AnimalProfileComponent animal={animal} />
                     <div className={styles.profileBtn}>
                       <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(animal.id!)}
                       >
                         Șterge
                       </button>
                     </div>
                   </div>
                ))}
              </div>
           )}
         </div>
       </Authentication>
     </Layout>
  );
};
export default Animals;