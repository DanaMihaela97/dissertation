
import { AnimalProfile } from '@/components/entities/animalProfile';
import Navbar from '@/components/Navbar';
import { getAnimalById, getVaccines } from '@/services/animalService';
import { Cat, Dog } from 'lucide-react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { AnimalVaccine } from '@/components/entities/animalVaccine';
import { Vaccine } from '@/components/entities/vaccines';
import { startChat } from '@/services/sessionService';

type Props = {
  animal: AnimalProfile | null;
};

const TABS = ['Profil', 'Vaccinuri', 'Diagnostic', 'Tratament', 'Sfaturi'];

export default function AnimalPage({ animal }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profil');

  if (router.isFallback) {
    return <div>Se încarcă...</div>;
  }

  if (!animal) return <div>Animalul nu a fost găsit.</div>;

  const animalIcon = animal.type === 'Câine' ? <Dog size={40} /> : <Cat size={40} />;
  const [vaccinesMap, setVaccinesMap] = useState<Record<number, Vaccine>>({});

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const vaccinesList = await getVaccines();
        const map: Record<number, Vaccine> = {};
        vaccinesList.forEach(v => {
          map[v.id] = v;
        });
        setVaccinesMap(map);
      } catch (error) {
        console.error('Eroare la încărcarea vaccinurilor:', error);
      }
    };

    fetchVaccines();
  }, []);

  function calcNextDoseDate(animalVaccine: AnimalVaccine, vaccine: Vaccine): string | null {
    if (!animalVaccine.dateAdministered || vaccine?.rapel_days == -1) {
      return "-";
    }
    const dateAdministered = new Date(animalVaccine.dateAdministered);
    const nextDose = new Date(dateAdministered.getTime() + vaccine.rapel_days * 86400000);
    return nextDose.toLocaleDateString();
  }

const handleStartConsultation = async () => {
  try {
    const response = await startChat(animal); 
    console.log("Sesiune pornită:", response);
    router.push(`/chat/${response.sessionId}`);
  } catch (error) {
    console.error("Eroare la începerea consultației:", error);
    alert("A apărut o eroare la începerea consultației.");
  }
};
  return (
    <>
      <Navbar />
      <div className="">
        <div className={styles.tabsWrapper}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.separator}></div>
        <div className="mb-4 flex justify-end">
          <button
             onClick={handleStartConsultation}
            className={styles.startConsultationButton} 
          >
            Începe o consultație
          </button>
        </div>
        <div className={styles.contentWrapper}>
          {activeTab === 'Profil' && (

            <div className={styles.card}>
              <div className={styles.header}>
                <div className={styles.nameWithIcon}>
                  {animalIcon}
                  <h2 className={styles.animalName}>{animal.animalName}</h2>
                </div>
                <p className={styles.breed}>{animal.breed}</p>
              </div>
              <div className={styles.detailsList}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Vârstă:</span>
                  <span>{animal.age}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Sex:</span>
                  <span>{animal.sex}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Greutate:</span>
                  <span>{animal.weight} kg</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Tip:</span>
                  <span>{animal.type}</span>
                </div>
                {animal.birthdate && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Data nașterii:</span>
                    <span>{new Date(animal.birthdate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'Vaccinuri' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Istoric vaccinuri</h3>
              {animal.vaccines && animal.vaccines.length > 0 ? (
                animal.vaccines.map((animalVaccine) => {
                  const vaccine = vaccinesMap[animalVaccine.vaccineId];
                  const nextDoseDate = calcNextDoseDate(animalVaccine, vaccine);
                  console.log(vaccine);
                  return (
                    <div
                      key={vaccine.id}
                      className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500"
                    >
                      <h4 className="text-lg font-bold">{vaccine.name}</h4>
                      <p className="mt-2 text-gray-700 italic"></p>
                      <p className="mt-2">
                        <strong>Administrat:</strong>{' '}
                        {new Date(animalVaccine.dateAdministered).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Următoarea doză:</strong>{' '}
                        {nextDoseDate || 'Nespecificat'}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>Nu există vaccinuri înregistrate.</p>
              )}
            </div>
          )}


          {['Diagnostic', 'Tratament', 'Sfaturi'].includes(activeTab) && (
            <div className="text-gray-500 italic">Conținut în curs de implementare pentru tabul "{activeTab}".</div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { id } = context.params as { id: string };
  const token = context.req.cookies?.jwt;

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