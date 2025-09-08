import React, {useState} from 'react';
import styles from './LocateClinics.module.css';
import {locateVetClinics} from "@/services/locateVetClinics";
import {Clinic} from "@/components/entities/clinic";
import {Clock, MapPin, Phone, X} from 'lucide-react';

export default function LocateClinics() {
   const [number, setNumber] = useState('');
   const [city, setCity] = useState('');
   const [clinics, setClinics] = useState<Clinic[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [streetType, setStreetType] = useState("Strada");
   const [streetName, setStreetName] = useState("");

   function getAddress() {
      return `${streetType}+${streetName}+${number}`;
   }

   function getFullAddress() {
      return `${streetType}+${streetName}+${number}+${city}`;
   }

   async function handleLocate(e: React.FormEvent) {
      e.preventDefault();

      if (!streetName.trim() || !number.trim() || !city.trim()) {
         setError('Toate câmpurile sunt obligatorii.');
         setClinics([]);
         return;
      }


      setLoading(true);
      setError(null);

      try {
         const data = await locateVetClinics(getAddress(), city);
         setClinics(data);
         setShowModal(true);
      } catch (err) {
         console.error(err);
         setError('Adresă invalidă sau eroare la căutare.');
         setClinics([]);
         setShowModal(false);
      }
   }

   const isFormValid = streetName.trim() !== '' && number.trim() !== '' && city.trim() !== '';
   const [showModal, setShowModal] = useState(false);

   return (
      <div className={styles.locateContainer}>
         <h2 className={styles.title}>
            <MapPin size={28} color="#2563eb" style={{ marginRight: '10px' }}/>
            Găsește rapid cabinetele veterinare din zona ta
         </h2>


         <form onSubmit={handleLocate} className={styles.form}>
            <label className={styles.label}>Introdu adresa ta</label>

            <div className={styles.inputGroup}>
               <label htmlFor="streetType" className={styles.smallLabel}>Selectează tipul străzii</label>
               <select
                  id="streetType"
                  value={streetType}
                  onChange={(e) => setStreetType(e.target.value)}
                  className={styles.prefixSelect}
               >
                  <option>Strada</option>
                  <option>Bulevardul</option>
                  <option>Aleea</option>
                  <option>Șoseaua</option>
               </select>
            </div>

            <div className={styles.inputGroup}>
               <label htmlFor="streetName" className={styles.smallLabel}>Numele străzii</label>
               <input
                  id="streetName"
                  type="text"
                  placeholder="ex: Mihai Eminescu"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  className={styles.input}
                  required
               />
            </div>

            <div className={styles.rowInputs}>
               <div className={styles.inputGroup}>
                  <label htmlFor="number" className={styles.smallLabel}>Numărul</label>
                  <input
                     id="number"
                     type="text"
                     placeholder="ex: 15"
                     value={number}
                     onChange={(e) => setNumber(e.target.value)}
                     className={styles.inputSmall}
                     required
                  />
               </div>

               <div className={styles.inputGroup}>
                  <label htmlFor="city" className={styles.smallLabel}>Orașul</label>
                  <input
                     id="city"
                     type="text"
                     placeholder="ex: București"
                     value={city}
                     onChange={(e) => setCity(e.target.value)}
                     className={styles.input}
                     required
                  />
               </div>
            </div>


            <button
               type="submit"
               disabled={!isFormValid || loading}
               className={styles.button}
            >
               {loading ? (
                  <>
                     <span className={styles.spinner}></span>
                     Căutare...
                  </>
               ) : (
                  'Caută cabinete din zona mea'
               )}
            </button>

         </form>

         {error && <p className={styles.error}>{error}</p>}


         {showModal && (
            <div className={styles.modalOverlay} onClick={() => {
               setShowModal(false);
               setLoading(false);
               setError(null);
            }}>
               <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <button
                     className={styles.closeButton}
                     onClick={() => {
                        setShowModal(false);
                        setLoading(false);
                        setError(null);
                     }}
                  >
                     <X className="w-5 h-5"/>
                  </button>
                  <h3><MapPin size={28} style={{marginRight: '8px'}} color="#28a745"/>Clinici Veterinare din Zona Ta
                  </h3>
                  {clinics.map((clinic, i) => {
                     const mapsUrl = `https://www.google.com/maps/dir/?api=1` +
                        `&origin=${getFullAddress()}` +
                        `&destination=${encodeURIComponent(clinic.coordinates)}`;
                     return (
                        <div key={i} className={styles.card}>
                           <div className={styles.cardHeader}>
                              <h4 className={styles.clinicName}>{clinic.name}</h4>
                              <span className={styles.distance}>{clinic.distance}</span>
                           </div>

                           <p className={styles.address}>{clinic.address}</p>

                           <div className={styles.cardFooter}>
                            <span className={styles.phone}>
                                    <Phone size={16}/>
                               {clinic.phone ? clinic.phone : "Număr de telefon indisponibil"}
                                 </span>

                              <div className={styles.schedule}>
                                 {clinic.hours && clinic.hours.length > 0 ? (
                                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                       <Clock size={16}/>
                                       <span>{clinic.hours.join(', ')}</span>
                                    </div>
                                 ) : (
                                    <span>Program indisponibil</span>
                                 )}
                              </div>
                           </div>

                           <div className={styles.cardActions}>
                              <a href={`tel:${clinic.phone}`} className={styles.callButton}>Sună</a>
                              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                                 className={styles.detailsButton}>Vezi pe hartă</a>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         )}
      </div>

   );
}