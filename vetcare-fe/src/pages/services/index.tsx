import {useRouter} from 'next/router';
import Layout from '@/components/Layout';
import Image from 'next/image';
import styles from './Services.module.css';

export default function VetConsultations() {
   const router = useRouter();

   return (
      <Layout>
         <div className="container">
            <section className={styles.hero}>
               <h1 className="h2Title">Consultații Veterinare Online</h1>
               <p className={styles.heroDescription}>
                  Obține diagnostic și recomandări pentru animalul tău de companie direct de acasă, cu ajutorul
                  inteligenței
                  artificiale.
               </p>
            </section>

            <section className={styles.features}>
               <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                     <Image src="/examination.png" alt="Stethoscope" width={66} height={66}/>
                  </div>
                  <h3>Diagnostic AI</h3>
                  <p>Diagnostic preliminar bazat pe simptomele și istoricul medical al animalului tău</p>
               </div>

               <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                     <Image src="/band-aid.png" alt="Stethoscope" width={60} height={60}/>
                  </div>
                  <h3>Recomandări Tratament</h3>
                  <p>Recomandări personalizate pentru tratament și îngrijire</p>
               </div>

               <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                     <Image src="/bell.png" alt="Stethoscope" width={60} height={60}/>
                  </div>
                  <h3>Memento-uri Automate</h3>
                  <p>Memento-uri pentru administrarea medicamentelor și programări</p>
               </div>

               <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                     <Image src="/pin.png" alt="Stethoscope" width={60} height={60}/>
                  </div>
                  <h3>Clinici Apropiate</h3>
                  <p>Recomandări de clinici veterinare din zona ta</p>
               </div>
            </section>

            <section className={styles.howItWorks}>
               <h2>Cum funcționează</h2>
               <p className={styles.sectionDescription}>
                  Obține un diagnostic preliminar și recomandări în doar câțiva pași simpli
               </p>

               <div className={styles.steps}>
                  <div className={styles.step}>
                     <div className={styles.stepNumber}>1</div>
                     <h3>Creează-ți cont</h3>
                     <p>Înregistrează-te pentru a putea folosi toate funcționalitățile aplicației</p>
                  </div>

                  <div className={styles.step}>
                     <div className={styles.stepNumber}>2</div>
                     <h3>Creează profil pentru animalul tău</h3>
                     <p>Adaugă informații esențiale precum specie, rasă, vârstă și greutate</p>
                  </div>

                  <div className={styles.step}>
                     <div className={styles.stepNumber}>3</div>
                     <h3>Completează formularul</h3>
                     <p>Introdu informațiile despre animalul tău</p>
                  </div>

                  <div className={styles.step}>
                     <div className={styles.stepNumber}>4</div>
                     <h3>Începe consultația</h3>
                     <p>Introdu simptomele observate la animalul tău</p>
                  </div>

                  <div className={styles.step}>
                     <div className={styles.stepNumber}>5</div>
                     <h3>Urmează recomandările</h3>
                     <p>Primești recomandări de tratament și memento-uri pentru administrarea medicamentelor</p>
                  </div>
               </div>

               <div className={styles.fixedCtaButtonWrapper}>
                  <button
                     className={styles.fixedCtaButton}
                     onClick={() => router.push('/register')}
                  >
                     Creează profilul animalului și începe consultația
                  </button>
               </div>
            </section>
         </div>
      </Layout>
   );
}
