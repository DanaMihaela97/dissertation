// import AnimalProfileComponent from '@/components/AnimalProfileComponent';
// import { AnimalProfile } from '@/components/entities/animalProfile';
// import { CreateAnimalProfile } from '@/components/entities/createAnimalProfile';
// import Navbar from '@/components/Navbar';
// import { getAllAnimals, getVaccines } from '@/services/animalService';
// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';

// const Animals = () => {
// const [animals, setAnimals] = useState<AnimalProfile[]>([]);
// const [vaccineMap, setVaccineMap] = useState<Record<number, string>>({});
// const router = useRouter();
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const [animalsResult, vaccinesResult] = await Promise.all([
//         getAllAnimals(),
//         getVaccines()
//       ]);

//       const vaccineNameMap: Record<number, string> = {};
//       vaccinesResult.forEach(vaccine => {
//         if (vaccine.id && vaccine.name) {
//           vaccineNameMap[vaccine.id] = vaccine.name;
//         }
//       });

//       const animalsWithVaccines = animalsResult.map(animal => ({
//         ...animal,
//         vaccines: (animal.vaccines || []).map(v => ({
//           ...v,
//           vaccineName: vaccineNameMap[v.vaccineId] || undefined
//         }))
//       }));

//       setVaccineMap(vaccineNameMap);
//       setAnimals(animalsWithVaccines);
//     } catch (error) {
//       console.error("Eroare la preluarea datelor:", error);
//     }
//   };

//   fetchData();
// }, []);

//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: '20px' }}>
//         <h2>Profiluri animale</h2>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <ul>
//             {animals.map((animal, index) => (
//               <li key={animal.id}>
//             <AnimalProfileComponent key={index} animal={animal} />
//                         <button onClick={() => router.push(`/animals/${animal.id}`)}>
//                           Vezi detalii
//                         </button>
//               </li>
//           ))}
//           </ul>
          
//         </div>
//       </div>
//     </>
//   );
// };

// export default Animals;
import AnimalProfileComponent from '@/components/AnimalProfileComponent';
import { AnimalProfile } from '@/components/entities/animalProfile';
import { Vaccine } from '@/components/entities/vaccines';
import Navbar from '@/components/Navbar';
import { getAllAnimals, getVaccines } from '@/services/animalService';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ul>
            {animals.map((animal, index) => (
              <li key={animal.id}>
                <AnimalProfileComponent key={index} animal={animal} />
                <Link href={`/animals/${animal.id}`}>
                  Vezi detalii
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Animals;