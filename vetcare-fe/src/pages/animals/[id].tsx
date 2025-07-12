
import { AnimalProfile } from '@/components/entities/animalProfile';
import Navbar from '@/components/Navbar';
import { getAnimalById, getVaccines } from '@/services/animalService';
import { Calendar, Cat, Dog, Lightbulb, PawPrint, Pill, Stethoscope, Syringe } from 'lucide-react';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { AnimalVaccine } from '@/components/entities/animalVaccine';
import { Vaccine } from '@/components/entities/vaccines';
import { getConsultationsByAnimalId, startChat } from '@/services/sessionService';
import { Consultation } from '@/components/entities/consultation';

type Props = {
  animal: AnimalProfile | null;
};
type Tab = 'Profil' | 'Vaccinuri' | 'Diagnostic' | 'Tratament' | 'Sfaturi';

const TABS: Tab[] = ['Profil', 'Vaccinuri', 'Diagnostic', 'Tratament', 'Sfaturi'];
const TAB_DETAILS: Record<Tab, { title: string; subtitle: string; icon: React.ReactElement }> = {
  Profil: {
    title: 'Profilul Animalului',
    subtitle: 'Informații despre pacientul veterinar',
    icon: <PawPrint size={24} />,
  },
  Vaccinuri: {
    title: 'Istoric Vaccinuri',
    subtitle: 'Programul de vaccinare și istoricul vaccinurilor',
    icon: <Syringe size={24} />,
  },
  Diagnostic: {
    title: 'Diagnostic',
    subtitle: 'Istoricul diagnosticelor veterinare',
    icon: <Stethoscope size={24} />,
  },
  Tratament: {
    title: 'Tratament',
    subtitle: 'Planurile de tratament recomandate',
    icon: <Pill size={24} />,
  },
  Sfaturi: {
    title: 'Recomandări',
    subtitle: 'Recomandări și sfaturi pentru îngrijire',
    icon: <Lightbulb size={24} />,
  },
};




export default function AnimalPage({ animal }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Profil');

  if (router.isFallback) {
    return <div>Se încarcă...</div>;
  }

  if (!animal) return <div>Animalul nu a fost găsit.</div>;

  const animalIcon = animal.type === 'Câine' ? <Dog size={40} /> : <Cat size={40} />;
  const [vaccinesMap, setVaccinesMap] = useState<Record<number, Vaccine>>({});
  const [consultations, setConsultations] = useState<Consultation[]>([]);
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
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await getConsultationsByAnimalId(animal.id);
        console.log('Consultații primite:', data);
        setConsultations(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Eroare la încărcarea consultațiilor:', error);
      }
    };

    fetchConsultations();
  }, [animal.id]);


  function calcNextDoseDate(animalVaccine: AnimalVaccine, vaccine: Vaccine): string | null {
    if (!animalVaccine.dateAdministered || vaccine?.rapel_days == -1) {
      return "Nu exista o urmatoare doza!";
    }
    const dateAdministered = new Date(animalVaccine.dateAdministered);
    const nextDose = new Date(dateAdministered.getTime() + vaccine.rapel_days * 86400000);
    return nextDose.toLocaleDateString();
  }

  const handleStartConsultation = async () => {
    try {
      const response = await startChat(animal);
      console.log("Sesiune pornită:", response);
      router.push(`/chat/${response.sessionId}?botMessage=${response.botResponse}`);
    } catch (error) {
      console.error("Eroare la începerea consultației:", error);
      alert("A apărut o eroare la începerea consultației.");
    }
  };
  function getAgeString(birthdate: string): string {
    const birth = new Date(birthdate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    if (now.getDate() < birth.getDate()) {
      months--; // nu a împlinit încă luna curentă
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years >= 1) {
      return `${years} ${years === 1 ? 'an' : 'ani'}`;
    } else {
      return `${months} ${months === 1 ? 'lună' : 'luni'}`;
    }
  }

  return (
    <>
      <Navbar />
      <div>
        <div style={{ display: 'flex', minHeight: '100vh' }}>

          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            width: '200px',
            borderRight: '1px solid #ddd',
            padding: '20px 10px',
            backgroundColor: '#fafafa',
          }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? '#14197b' : 'transparent',
                  color: activeTab === tab ? 'white' : '#333',
                  border: 'none',
                  padding: '12px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  transition: 'background-color 0.3s',
                }}
              >
                {tab}
              </button>
            ))}

            <button
              onClick={handleStartConsultation}
              className={styles.startConsultationButton}
            >
              Începe o consultație
            </button>
          </nav>

          <div
            style={{
              padding: '20px 30px',
              ...(activeTab !== 'Vaccinuri' && {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }),
            }}
          >

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h1 style={{ margin: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      backgroundColor:
                        activeTab === 'Profil' ? '#d8d8d8' :
                          activeTab === 'Vaccinuri' ? '#e6ccff' :
                            activeTab === 'Diagnostic' ? '#cce5ff' :
                              activeTab === 'Tratament' ? '#d0f0c0' :
                                activeTab === 'Sfaturi' ? '#ffe5cc' :
                                  'transparent',
                      borderRadius: '50%',
                      padding: '9px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(TAB_DETAILS[activeTab as Tab].icon, {
                      color:
                        activeTab === 'Profil' ? '#5a5a5a' :
                          activeTab === 'Vaccinuri' ? '#5e15a3' :
                            activeTab === 'Diagnostic' ? '#004085' :
                              activeTab === 'Tratament' ? '#207f3e' :
                                activeTab === 'Sfaturi' ? '#d35400' :
                                  '#000000',
                      size: 25,
                    })}
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.7rem', lineHeight: 1.2 }}>
                      {TAB_DETAILS[activeTab as Tab].title}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: '#666', marginTop: '2px' }}>
                      {TAB_DETAILS[activeTab as Tab].subtitle}
                    </span>
                  </div>
                </div>
              </h1>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {activeTab === 'Profil' && (
                <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className={`${styles.card} ${activeTab === 'Profil' ? styles.profilView : ''}`}>
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
                        <span className={styles.detailText}>{getAgeString(animal.birthdate)}</span>
                      </div>


                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Sex:</span>
                        <span className={styles.detailText}>{animal.sex}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Greutate:</span>
                        <span className={styles.detailText}>{animal.weight} kg</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Tip:</span>
                        <span className={styles.detailText}>{animal.type}</span>
                      </div>
                      {animal.birthdate && (
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Data nașterii:</span>
                          <span className={styles.detailText}>{new Date(animal.birthdate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}


              {activeTab === 'Vaccinuri' && (
                <div className={styles.mainCardVaccine}>
                  {animal.vaccines && animal.vaccines.length > 0 ? (
                    animal.vaccines.map((animalVaccine) => {
                      const vaccine = vaccinesMap[animalVaccine.vaccineId];
                      const nextDoseDate = calcNextDoseDate(animalVaccine, vaccine);
                      return (
                        <div key={vaccine.id} className={styles.vaccinCard} >
                          <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>{vaccine.name}</span>
                            <div className={styles.dateWithIcon}>
                              <Calendar size={16} className={styles.calendarIcon} />
                              <span>{new Date(animalVaccine.dateAdministered).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={styles.vaccinBox}>
                            <Syringe size={20} className={styles.vaccinIcon} />
                            <strong>Administrat</strong>
                            <p>{new Date(animalVaccine.dateAdministered).toLocaleDateString()}</p>
                            <strong>Următoarea doză</strong>
                            <p>{nextDoseDate || 'Nespecificat'}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>Nu există vaccinuri înregistrate.</p>
                  )}
                </div>
              )}

              {['Diagnostic', 'Tratament', 'Sfaturi'].includes(activeTab) && (
                <div className="space-y-4">
                  {consultations.length > 0 ? (
                    consultations.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        {activeTab === 'Diagnostic' && (
                          <div className={styles.consultationCard}>
                            <div className={styles.cardHeader}>
                              <span className={styles.cardTitle}>Consultație Medicală</span>
                              <div className={styles.dateWithIconDiagnostic}>
                                <Calendar size={16} className={styles.calendarIconDiagnostic} />
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className={styles.diagnosisBox}>
                              <Stethoscope size={20} className={styles.diagnosisIcon} />
                              <strong>Diagnostic</strong>
                              <p>{c.diagnosis || 'Nicio informație disponibilă.'}</p>
                            </div>
                          </div>
                        )}

                        {activeTab === 'Tratament' && (
                          <div className={styles.treatmentCard}>
                            <div className={styles.cardHeader}>
                              <span className={styles.cardTitle}>Consultație Medicală</span>
                              <div className={styles.dateWithIconTreatment}>
                                <Calendar size={16} className={styles.calendarIconTreatment} />
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className={styles.treatmentBox}>
                              <Pill size={20} className={styles.treatmentIcon} />
                              <strong>Tratament</strong>
                              <p>{c.treatment || 'Nicio informație disponibilă.'}</p>
                            </div>
                          </div>
                        )}

                        {activeTab === 'Sfaturi' && (
                          <div className={styles.adviceCard}>
                            <div className={styles.cardHeader}>
                              <span className={styles.cardTitle}>Consultație Medicală</span>
                              <div className={styles.dateWithIconAdvice}>
                                <Calendar size={16} className={styles.calendarIconAdvice} />
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className={styles.adviceBox}>
                              <Lightbulb size={20} className={styles.adviceIcon} />
                              <strong>Recomandari</strong>
                              <p>{c.advice || 'Nicio informație disponibilă.'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="italic text-gray-500">Nu există consultații pentru acest animal.</p>
                  )}
                </div>
              )}

            </div>
          </div>
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