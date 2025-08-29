import {AnimalProfile} from '@/components/entities/animalProfile';
import {
   deleteAnimalVaccine,
   getAnimalById,
   getCatBreeds, getDogBreeds,
   getVaccines,
   updateAnimal
} from '@/services/animalService';
import {Calendar, Cat, Dog, Lightbulb, Pill, Stethoscope, Syringe} from 'lucide-react';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styles from './PerAnimal.module.css';
import {AnimalVaccine} from '@/components/entities/animalVaccine';
import {Vaccine} from '@/components/entities/vaccines';
import {getConsultationsByAnimalId, startChat} from '@/services/sessionService';
import {Consultation} from '@/components/entities/consultation';
import Layout from "@/components/Layout";
import {getAgeString} from "@/utils/animalData";
import Swal from "sweetalert2";
import {VaccinesModal} from "@/components/Vaccines/VaccinesModal";
import Authentication from "@/components/Authentication";
import {TABS, TAB_DETAILS, Tab} from "@/constants/tabs";
import EditModal from "@/components/EditProfile";

export default function AnimalPage() {
   const router = useRouter();
   const {id} = router.query;

   const [animal, setAnimal] = useState<AnimalProfile | null>(null);
   const [activeTab, setActiveTab] = useState("Profil");
   const [vaccinesMap, setVaccinesMap] = useState<Record<number, Vaccine>>({});
   const [consultations, setConsultations] = useState<Consultation[]>([]);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [formData, setFormData] = useState<AnimalProfile | null>(null);
   const [breeds, setBreeds] = useState<string[]>([]);
   const [isMobile] = useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleAddVaccines = () => {
      setIsModalOpen(true);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!formData) return;
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
   };

   const handleSave = async () => {
      if (!formData) return;

      await updateAnimal(formData.id, formData);
      setAnimal(formData);

      Swal.fire({
         icon: 'success',
         title: 'Profilul a fost actualizat cu succes',
         showConfirmButton: false,
         timer: 1500
      });

      setIsEditOpen(false);
   };

   const handleTabClick = (tab) => {
      setActiveTab(tab);
      if (isMobile) setIsOpen(false);
   };
   const handleStartConsultation = async () => {
      if (!animal) return;
      try {
         const response = await startChat(animal);
         sessionStorage.setItem("greeting", response.botResponse);
         console.log("Set the greeting", response.botResponse);
         router.push(`/chat/${response.sessionId}`, undefined, {shallow: true});
      } catch (error) {
         console.error(error);
      }
   };

   function calcNextDoseDate(animalVaccine: AnimalVaccine, vaccine: Vaccine): string | null {
      if (vaccine?.rapelDays === -1) {
         return "Nu există o următoare doză!";
      }

      if (animalVaccine.secondDoseDate) {
         return "Schema de vaccinare este completă";
      }

      if (animalVaccine.firstDoseDate && !animalVaccine.secondDoseDate) {
         const firstDate = new Date(animalVaccine.firstDoseDate);
         const nextDose = new Date(firstDate);
         nextDose.setDate(firstDate.getDate() + vaccine.rapelDays);
         return nextDose.toLocaleDateString();
      }

      return null;
   }

   useEffect(() => {
      const loadBreeds = async () => {
         try {
            if (formData?.type === "Câine") {
               const breeds = await getDogBreeds();
               setBreeds(breeds);
            } else if (formData?.type === "Pisică") {
               const breeds = await getCatBreeds();
               setBreeds(breeds);
            } else {
               setBreeds([]);
            }
         } catch (err) {
            console.error(err);
         }
      };

      const loadAnimal = async () => {
         if (id) {
            try {
               const data = await getAnimalById(Number(id));
               setAnimal(data);
            } catch (err) {
               console.error(err);
            }
         }
      };

      const loadVaccines = async () => {
         try {
            const vaccinesList = await getVaccines();
            const map: Record<number, Vaccine> = {};
            vaccinesList.forEach((v) => (map[v.id] = v));
            setVaccinesMap(map);
         } catch (err) {
            console.error(err);
         }
      };

      const loadConsultations = async () => {
         if (animal?.id) {
            try {
               const data = await getConsultationsByAnimalId(animal.id);
               setConsultations(Array.isArray(data) ? data : [data]);
            } catch (err) {
               console.error(err);
            }
         }
      };

      loadBreeds();
      loadAnimal();
      loadVaccines();
      loadConsultations();
   }, [formData?.type, id, animal?.id]);


   const tabClass = {
      Profil: styles.iconProfil,
      Vaccinuri: styles.iconVaccinuri,
      Diagnostic: styles.iconDiagnostic,
      Tratament: styles.iconTratament,
      Sfaturi: styles.iconSfaturi,
   }[activeTab] || styles.iconDefault;

   const handleDelete = async (vaccineId: number) => {
      if (!animal?.id) return;

      const result = await Swal.fire({
         title: 'Ești sigur/ă că dorești să ștergi acest vaccin?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Da, șterge!',
         cancelButtonText: 'Anulează',
      });

      if (result.isConfirmed) {
         try {
            await deleteAnimalVaccine(animal.id, vaccineId);
            const updatedAnimal = await getAnimalById(animal.id);
            setAnimal(updatedAnimal);

            Swal.fire({
               icon: 'success',
               title: 'Vaccin șters cu succes',
               showConfirmButton: false,
               timer: 1500,
            });
         } catch (error) {
            console.error(error);
            Swal.fire({
               icon: 'error',
               title: 'Eroare la ștergerea vaccinului',
               text: 'Nu s-a putut șterge vaccinul.',
            });
         }
      }
   };

   return (
      <Layout>
         <Authentication>
            <div>
               <div className={styles.pageWrapper}>
                  <nav
                     className={`${styles.nav} ${isMobile && window.innerWidth <= 684 ? styles.navMobile : styles.navDesktop}`}
                  >

                     {(isOpen || !isMobile || (isMobile && window.innerWidth <= 684)) &&
                        TABS.map((tab) => (
                           <button
                              key={tab}
                              onClick={() => handleTabClick(tab)}
                              className={`${styles.tabButton} ${
                                 activeTab === tab ? styles.tabButtonActive : styles.tabButtonInactive
                              }`}
                           >
                              {tab}
                           </button>

                        ))}
                     <button
                        onClick={handleStartConsultation}
                        className={styles.startConsultationButton}
                        style={{
                           marginTop: isMobile && window.innerWidth <= 684 ? 0 : 'auto',
                           marginLeft: isMobile && window.innerWidth <= 684 ? 'auto' : 0,
                        }}
                     >
                        Începe o consultație
                     </button>
                  </nav>
                  <div
                     className={`${styles.containerPadding} ${activeTab !== 'Vaccinuri' ? styles.containerFlex : ''}`}>

                     <div className={styles.headerRow}>
                        <h1 className={styles.headerTitle}>
                           <div className={styles.titleWrapper}>
                          <span className={`${styles.tabIcon} 
                                           ${activeTab === 'Profil' ? styles.tabProfil : ''} 
                                           ${activeTab === 'Vaccinuri' ? styles.tabVaccinuri : ''} 
                                           ${activeTab === 'Diagnostic' ? styles.tabDiagnostic : ''} 
                                           ${activeTab === 'Tratament' ? styles.tabTratament : ''} 
                                           ${activeTab === 'Recomandări' ? styles.tabSfaturi : styles.tabDefault}`}
                          >
                         <span className={`${styles.iconBase} ${tabClass}`}>
                           {TAB_DETAILS[activeTab as Tab].icon}
                         </span>
                       </span>

                                             <div className={styles.textWrapper}>
                         <span className={styles.mainTitle}>
                           {TAB_DETAILS[activeTab as Tab].title}
                         </span>
                                                <span className={styles.subTitle}>
                           {TAB_DETAILS[activeTab as Tab].subtitle}
                         </span>
                              </div>
                           </div>
                        </h1>
                     </div>

                     <div style={{flex: 1, overflowY: 'auto'}}>
                        {activeTab === 'Profil' && animal != null && (
                           <div className={styles.container}
                                style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <div className={`${styles.card} ${activeTab === 'Profil' ? styles.profilView : ''}`}>
                                 <div className={styles.header}>
                                    <div className={styles.nameWithIcon}>
                                       {animal.type === "Câine" ? <Dog size={40}/> : <Cat size={40}/>}
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
                                          <span
                                             className={styles.detailText}>{new Date(animal.birthdate).toLocaleDateString()}</span>
                                       </div>
                                    )}
                                 </div>
                                 <button
                                    className={styles.editButton}
                                    onClick={() => {
                                       setFormData(animal);
                                       setIsEditOpen(true);
                                    }}
                                 >
                                    Editează
                                 </button>

                                 {isEditOpen && formData && (
                                    <EditModal
                                       isOpen={isEditOpen}
                                       formData={formData}
                                       breeds={breeds}
                                       onChange={handleChange}
                                       onSave={handleSave}
                                       onClose={() => setIsEditOpen(false)}
                                    />
                                 )}

                              </div>
                           </div>
                        )}
                        {activeTab === 'Vaccinuri' && (
                           <div className={styles.mainCardVaccine}>
                              <div>
                                 <button className={styles.editButtonVac} onClick={handleAddVaccines}>Adaugă / Editează
                                    vaccinuri
                                 </button>
                              </div>
                              <div className={styles.vaccineSection}>
                                 {animal.vaccines && animal.vaccines.length > 0 ? (
                                    animal.vaccines.map((animalVaccine) => {
                                       const vaccine = vaccinesMap[animalVaccine.vaccineId];
                                       const nextDoseDate = calcNextDoseDate(animalVaccine, vaccine);

                                       return (
                                          <div key={vaccine.id} className={styles.vaccinCard}>
                                             <div className={styles.vaccinBox}>
                                                <div className={styles.vaccineHeader}>
                                                   <Syringe size={20} className={styles.vaccinIcon} />
                                                   <p className={styles.vaccineTitle}>{vaccine.name}</p>
                                                </div>
                                                <strong>Prima doză</strong>
                                                <p>
                                                   {animalVaccine.firstDoseDate
                                                      ? new Date(animalVaccine.firstDoseDate).toLocaleDateString()
                                                      : "Nu a fost administrată"}
                                                </p>

                                                <strong>A doua doză</strong>
                                                <p>
                                                   {animalVaccine.secondDoseDate
                                                      ? new Date(animalVaccine.secondDoseDate).toLocaleDateString()
                                                      : "Nu a fost administrată"}
                                                </p>
                                                <br />
                                                <strong>Următoarea doză</strong>
                                                <p>{nextDoseDate || "Nespecificat"}</p>
                                             </div>

                                             <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(vaccine.id)}
                                             >
                                                Șterge
                                             </button>
                                          </div>
                                       );
                                    })
                                 ) : (
                                    <p>Nu există vaccinuri înregistrate.</p>
                                 )}

                              </div>
                           </div>
                        )}
                        {isModalOpen && (
                           <VaccinesModal
                              animalType={animal.type}
                              animalId={animal.id}
                              animalVaccines={animal.vaccines}
                              onClose={() => setIsModalOpen(false)}
                              onSave={(updatedVaccines) => {
                                 setAnimal(prev => prev ? {...prev, vaccines: updatedVaccines} : prev);
                              }}
                           />

                        )}

                        {['Diagnostic', 'Tratament', 'Recomandări'].includes(activeTab) && (
                           <div className="space-y-4">
                              {consultations.length > 0 ? (
                                 [...consultations]
                                 .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                 .map((c) => (
                                    <div
                                       key={c.id}
                                       className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                                       style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          justifyContent: 'space-between'
                                       }}
                                    >
                                       {activeTab === 'Diagnostic' && (
                                          <div className={styles.consultationCard}>
                                             <div className={styles.cardHeader}>
                                                <span className={styles.cardTitle}>Consultație Medicală</span>
                                                <div className={styles.dateWithIconDiagnostic}>
                                                   <Calendar size={16} className={styles.calendarIconDiagnostic}/>
                                                   <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                             <div className={styles.diagnosisBox}>
                                                <Stethoscope size={20} className={styles.diagnosisIcon}/>
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
                                                   <Calendar size={16} className={styles.calendarIconTreatment}/>
                                                   <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                             <div className={styles.treatmentBox}>
                                                <Pill size={20} className={styles.treatmentIcon}/>
                                                <strong>Tratament</strong>
                                                <p>{c.treatment || 'Nicio informație disponibilă.'}</p>
                                             </div>
                                          </div>
                                       )}

                                       {activeTab === 'Recomandări' && (
                                          <div className={styles.adviceCard}>
                                             <div className={styles.cardHeader}>
                                                <span className={styles.cardTitle}>Consultație Medicală</span>
                                                <div className={styles.dateWithIconAdvice}>
                                                   <Calendar size={16} className={styles.calendarIconAdvice}/>
                                                   <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                             <div className={styles.adviceBox}>
                                                <Lightbulb size={20} className={styles.adviceIcon}/>
                                                <strong>Recomandări</strong>
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
         </Authentication>
      </Layout>
   );
}