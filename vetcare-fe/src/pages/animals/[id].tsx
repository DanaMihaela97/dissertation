import {AnimalProfile} from '@/components/entities/animalProfile';
import {
   deleteAnimalVaccine,
   getAnimalById,
   getCatBreeds, getDogBreeds,
   getVaccines,
   updateAnimal
} from '@/services/animalService';
import {Calendar, Cat, Dog, Lightbulb, PawPrint, Pill, Stethoscope, Syringe} from 'lucide-react';
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


type Props = {
   animal: AnimalProfile | null;
};
type Tab = 'Profil' | 'Vaccinuri' | 'Diagnostic' | 'Tratament' | 'Sfaturi';

const TABS: Tab[] = ['Profil', 'Vaccinuri', 'Diagnostic', 'Tratament', 'Sfaturi'];
const TAB_DETAILS: Record<Tab, { title: string; subtitle: string; icon: React.ReactElement }> = {
   Profil: {
      title: 'Profilul Animalului',
      subtitle: 'Informații despre pacientul veterinar',
      icon: <PawPrint size={24}/>,
   },
   Vaccinuri: {
      title: 'Istoric Vaccinuri',
      subtitle: 'Programul de vaccinare și istoricul vaccinurilor',
      icon: <Syringe size={24}/>,
   },
   Diagnostic: {
      title: 'Diagnostic',
      subtitle: 'Istoricul diagnosticelor veterinare',
      icon: <Stethoscope size={24}/>,
   },
   Tratament: {
      title: 'Tratament',
      subtitle: 'Planurile de tratament recomandate',
      icon: <Pill size={24}/>,
   },
   Sfaturi: {
      title: 'Recomandări',
      subtitle: 'Recomandări și sfaturi pentru îngrijire',
      icon: <Lightbulb size={24}/>,
   },
};

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

   const [isMobile, setIsMobile] = useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);


   const handleAddVaccines = () => {
      setIsModalOpen(true);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
         router.push(`/chat/${response.sessionId}`, undefined, { shallow: true });
      } catch (error) {
         console.error(error);
      }
   };

   function calcNextDoseDate(animalVaccine: AnimalVaccine, vaccine: Vaccine): string | null {
      if (!animalVaccine.dateAdministered || vaccine?.rapel_days === -1) {
         return "Nu exista o urmatoare doza!";
      }
      const nextDose = new Date(new Date(animalVaccine.dateAdministered).getTime() + vaccine.rapel_days * 86400000);
      return nextDose.toLocaleDateString();
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
         title: 'Ești sigur că dorești să ștergi acest vaccin?',
         text: "Această acțiune este ireversibilă!",
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
               <div
                  style={{
                     display: 'flex',
                     minHeight: '100vh',
                     flexDirection: isMobile && window.innerWidth <= 627 ? 'column' : 'row',
                  }}
               >
                  <nav
                     className={`${styles.nav} ${isMobile && window.innerWidth <= 627 ? styles.navMobile : styles.navDesktop}`}
                  >

                     {(isOpen || !isMobile || (isMobile && window.innerWidth <= 627)) &&
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
                           marginTop: isMobile && window.innerWidth <= 627 ? 0 : 'auto',
                           marginLeft: isMobile && window.innerWidth <= 627 ? 'auto' : 0,
                        }}
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

                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                     }}>
                        <h1 style={{margin: 0}}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <span
                     className={`${styles.tabIcon} 
                         ${activeTab === 'Profil' ? styles.tabProfil : ''} 
                         ${activeTab === 'Vaccinuri' ? styles.tabVaccinuri : ''} 
                         ${activeTab === 'Diagnostic' ? styles.tabDiagnostic : ''} 
                         ${activeTab === 'Tratament' ? styles.tabTratament : ''} 
                         ${activeTab === 'Sfaturi' ? styles.tabSfaturi : styles.tabDefault}
                           `}
                  >
                    <span className={`${styles.iconBase} ${tabClass}`}>
                             {TAB_DETAILS[activeTab as Tab].icon}
                           </span>
                  </span>

                              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <span style={{fontWeight: 'bold', fontSize: '1.7rem', lineHeight: 1.2}}>
                      {TAB_DETAILS[activeTab as Tab].title}
                    </span>
                                 <span style={{fontSize: '1.2rem', color: '#666', marginTop: '2px'}}>
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

                                 {isEditOpen && (
                                    <div className={styles.modalOverlay}>
                                       <div className={styles.modalContent}>
                                          <h2>Editează profilul</h2>
                                          {formData && (
                                             <>
                                                <b>
                                                   Nume</b>
                                                <input
                                                   type="text"
                                                   name="animalName"
                                                   value={formData.animalName}
                                                   onChange={handleChange}
                                                   className={styles.modalInput}
                                                   placeholder="Nume animal"
                                                />
                                                <b>
                                                   Rasa</b>
                                                <select
                                                   name="breed"
                                                   value={formData.breed}
                                                   onChange={handleChange}
                                                   className={styles.modalSelect}
                                                >
                                                   <option value="">Selectează rasa</option>
                                                   {breeds.map((b) => (
                                                      <option key={b} value={b}>
                                                         {b}
                                                      </option>
                                                   ))}
                                                </select>

                                                <b>Sex</b>
                                                <select
                                                   name="sex"
                                                   value={formData.sex}
                                                   onChange={handleChange}
                                                   className={styles.modalSelect}
                                                >
                                                   <option value="Mascul">Mascul</option>
                                                   <option value="Femelă">Femelă</option>
                                                </select>

                                                <b> Greutate</b>
                                                <input
                                                   type="text"
                                                   name="weight"
                                                   value={formData.weight}
                                                   onChange={handleChange}
                                                   className={styles.modalInput}
                                                   placeholder="Greutate (kg)"
                                                />

                                                <b>Tip</b>
                                                <select
                                                   name="type"
                                                   value={formData.type}
                                                   onChange={handleChange}
                                                   className={styles.modalSelect}
                                                >
                                                   <option value="Câine">Câine</option>
                                                   <option value="Pisică">Pisică</option>
                                                </select>
                                                <b> Data de nastere</b>
                                                <input
                                                   type="date"
                                                   name="birthdate"
                                                   value={formData.birthdate ? formData.birthdate.split("T")[0] : ""}
                                                   onChange={handleChange}
                                                   className={styles.modalInput}
                                                   max={new Date().toISOString().split("T")[0]}
                                                />


                                                <div className={styles.modalActions}>
                                                   <button className={styles.saveButton} onClick={handleSave}>
                                                      Salvează
                                                   </button>
                                                   <button
                                                      className={styles.cancelButton}
                                                      onClick={() => setIsEditOpen(false)}
                                                   >
                                                      Anulează
                                                   </button>
                                                </div>
                                             </>
                                          )}
                                       </div>
                                    </div>
                                 )}

                              </div>
                           </div>
                        )}
                        {activeTab === 'Vaccinuri' && (
                           <div className={styles.mainCardVaccine}>
                              <div>
                                 <button className={styles.editButtonVac} onClick={handleAddVaccines}>Adaugă vaccinuri
                                 </button>
                              </div>
                              <div className={styles.vaccineSection}>
                                 {animal.vaccines && animal.vaccines.length > 0 ? (
                                    animal.vaccines.map((animalVaccine) => {
                                       const vaccine = vaccinesMap[animalVaccine.vaccineId];
                                       const nextDoseDate = calcNextDoseDate(animalVaccine, vaccine);
                                       return (
                                          <div key={vaccine.id} className={styles.vaccinCard}>
                                             <div className={styles.cardHeader}>
                                                <span className={styles.cardTitle}>{vaccine.name}</span>
                                                <div className={styles.dateWithIcon}>
                                                   <Calendar size={16} className={styles.calendarIcon}/>
                                                   <span>{new Date(animalVaccine.dateAdministered).toLocaleDateString()}</span>
                                                </div>
                                             </div>
                                             <div className={styles.vaccinBox}>
                                                <Syringe size={20} className={styles.vaccinIcon}/>
                                                <strong>Administrat</strong>
                                                <p>{new Date(animalVaccine.dateAdministered).toLocaleDateString()}</p>
                                                <strong>Următoarea doză</strong>
                                                <p>{nextDoseDate || 'Nespecificat'}</p>
                                             </div>
                                             <button className={styles.deleteButton}
                                                     onClick={() => handleDelete(vaccine.id)}>Șterge
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

                        {['Diagnostic', 'Tratament', 'Sfaturi'].includes(activeTab) && (
                           <div className="space-y-4">
                              {consultations.length > 0 ? (
                                 consultations.map((c) => (
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

                                       {activeTab === 'Sfaturi' && (
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
         </Authentication>
      </Layout>
   );
}