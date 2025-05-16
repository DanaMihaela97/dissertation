// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { getAnimalById } from '@/services/animalService';
// import { AnimalProfile } from '@/components/entities/animalProfile';

// const AnimalDetails = () => {
//     // const {animalId } = useParams();
//     const router = useRouter();
//     const animalId = router.query.animalId;
//     const [animal, setAnimal] = useState<AnimalProfile | null>(null);

//     useEffect(() => {  
//         if (!animalId) return;

//         const fetchAnimalDetails = async () => {
//             try {
//                 const animalDetails = await getAnimalById(Number(animalId));
//                 setAnimal(animalDetails);
//             } catch (error) {
//                 console.error("Eroare la preluarea detaliilor animalului:", error);
//             }
//         };

//         fetchAnimalDetails();
//     }, [animalId]);

//     if (!animal) {
//         return <p>Încărcăm detaliile...</p>;
//     }

//     return (
//         <div>
//             <h2>{animal.animalName}</h2>
//             <p>Vârstă: {animal.age}</p>
//             <p>Sex: {animal.sex}</p>
//             <p>Tip: {animal.type}</p>
//             <p>Greutate: {animal.weight} kg</p>
//             <h4>Rasă: {animal.breed}</h4>
//             <h4>Vaccinuri administrate:</h4>
//             {animal.vaccines.length > 0 ? (
//                 <ul>
//                     {animal.vaccines.map((vaccine) => (
//                         <li key={vaccine.vaccineId}>
//                             {vaccine.vaccineName || 'Nume necunoscut'} - {new Date(vaccine.dateAdministered).toLocaleDateString()}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>Nu există vaccinuri înregistrate.</p>
//             )}
//         </div>
//     );
// };

// export default AnimalDetails;
import { AnimalProfile } from '@/components/entities/animalProfile';
import { getAnimalById } from '@/services/animalService';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  animal: AnimalProfile | null;
};

export default function AnimalPage({ animal }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Se încarcă...</div>;
  }

  if (!animal) return <div>Animalul nu a fost găsit.</div>;

  return (
    <div>
      <h1>{animal.animalName}</h1>
      <p>Vârstă: {animal.age}</p>
      <p>Sex: {animal.sex}</p>
      <p>Tip: {animal.type}</p>
      <p>Greutate: {animal.weight} kg</p>
      <h4>Rasă: {animal.breed}</h4>
      <h4>Vaccinuri administrate:</h4>
      {animal.vaccines && animal.vaccines.length > 0 ? (
        <ul>
          {animal.vaccines.map((vaccine) => (
            <li key={vaccine.vaccineId}>
              {vaccine.vaccineName || 'Nume necunoscut'} - {new Date(vaccine.dateAdministered).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu există vaccinuri înregistrate.</p>
      )}
    </div>
  );
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { id } = context.params as { id: string };

  // Extrage JWT din cookie (dacă l-ai salvat acolo la login)
  const token = context.req.cookies?.jwt; // asigură-te că setezi cookie-ul la login
  
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const animal = await getAnimalById(Number(id), token);

  return {
    props: {
      animal: animal || null,
    },
  };
  
};
