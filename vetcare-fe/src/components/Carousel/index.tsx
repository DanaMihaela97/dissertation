import React, { useState } from "react";
import styles from "./Carousel.module.css";
import {ArrowLeft, ArrowRight} from "lucide-react";
import Image from "next/image";

const diseases = [
   {
      animal: "Pisici",
      breed: "Persană",
      name: "Afecțiuni frecvente la pisicile Persane",
      symptoms: [
         "Dificultăți de respirație și infecții respiratorii (sindrom brahicefalic)",
         "Formarea de chisturi la nivelul rinichilor (boala polichistică renală - PKD)",
         "Iritații oculare, entropion, ulcer cornean"
      ],
      prevention: [
         "Teste genetice pentru PKD",
         "Monitorizarea frecventă a rinichilor",
         "Igienă regulată a ochilor și nasului"
      ],
      image: "/persana.jpg"
   },
   {
      animal: "Pisici",
      breed: "Siameză",
      name: "Afecțiuni frecvente la pisicile Siameze",
      symptoms: [
         "Gingivită și alte probleme dentare",
         "Astm felin (respirație îngreunată, tuse, șuierat)",
         "Pierderea excesivă a părului din cauza stresului (alopecie psihogenă)"
      ],
      prevention: [
         "Vizite regulate la veterinar pentru igienă dentară",
         "Monitorizarea respirației"
      ],
      image: "/siameza.jpg"
   },
   {
      animal: "Pisici",
      breed: "Maine Coon",
      name: "Afecțiuni frecvente la pisicile Maine Coon",
      symptoms: [
         "Cardiomiopatie hipertrofică (HCM)",
         "Probleme articulare, displazie de șold",
         "Probleme dentare"
      ],
      prevention: [
         "Teste genetice pentru HCM",
         "Controale periodice pentru articulații și dinți"
      ],
      image: "/maine%20coon.jpg"

   },
   {
      animal: "Câini",
      breed: "Ciobănesc German",
      name: "Afecțiuni frecvente la Ciobănescul German",
      symptoms: [
         "Displazie de șold și cot (durere și dificultăți de mișcare)",
         "Șchiopătare temporară (panosteită)",
         "Dilatație și torsiune gastrică (GDV)"
      ],
      prevention: [
         "Dietă echilibrată",
         "Evitarea efortului fizic intens imediat după mese",
         "Menținerea greutății optime și controlul activității fizice"
      ],
      image: "/ciobanesc.jpg"
   },
   {
      animal: "Câini",
      breed: "Boxer",
      name: "Afecțiuni frecvente la Boxer",
      symptoms: [
         "Cardiomiopatie dilatativă",
         "Tumori cutanate (mastocitom)",
         "Probleme respiratorii din cauza botului scurt"
      ],
      prevention: [
         "Examene cardiace regulate",
         "Monitorizarea pielii pentru modificări"
      ],
      image: "/boxer.jpg"
   },
   {
      animal: "Câini",
      breed: "Golden Retriever",
      name: "Afecțiuni frecvente la Golden Retriever",
      symptoms: [
         "Displazie de șold și cot",
         "Dermatită alergică (mâncărimi, roșeață)",
         "Risc crescut de cancer (hemangiosarcom, limfom)"
      ],
      prevention: [
         "Igienă riguroasă a blănii",
         "Screening veterinar regulat pentru cancer"
      ],
      image: "/golden.jpg"
   },
];


const CarouselDiseases = () => {
   const [current, setCurrent] = useState(0);
   const length = diseases.length;

   const nextSlide = () => {
      setCurrent(current === length - 1 ? 0 : current + 1);
   };

   const prevSlide = () => {
      setCurrent(current === 0 ? length - 1 : current - 1);
   };

   const { animal, name, symptoms, prevention, image } = diseases[current];

   return (
      <div className={styles.carouselContainer}>
         <h2 className={styles.title}>Boli comune la caini si pisici, in functie de rasa</h2>
         <p className={styles.subtitle}>
            Informează-te despre cele mai frecvente probleme de sănătate
         </p>

         <div className={styles.carouselBox}>
            <button
               onClick={prevSlide}
               className={`${styles.navButton} ${styles.prevButton}`}
               aria-label="Previous"
            >
               <ArrowLeft size={20} style={{ display: "block", margin: "auto" }} />


            </button>

            <div className={styles.leftSection}>
               <div className={styles.animalType}>{animal}</div>
               <div className={styles.diseaseName}>{name}</div>
               <div className={styles.infoSections}>
                  <div className={styles.infoBlock}>
                     <h4>Simptome comune:</h4>
                     <ul>
                        {symptoms.map((symptom, i) => (
                           <li key={i}>{symptom}</li>
                        ))}
                     </ul>
                  </div>
                  <div className={styles.infoBlock}>
                     <h4>Prevenție:</h4>
                     <ul>
                        {prevention.map((item, i) => (
                           <li key={i}>{item}</li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            <div className={styles.imageSection}>
               <Image
                  src={image}
                  alt={`${name} - ${animal}`}
                  width={400}      // ajustează după nevoie
                  height={300}     // ajustează după nevoie
                  style={{ objectFit: "cover" }} // opțional
               />
            </div>

            <button
               onClick={nextSlide}
               className={`${styles.navButton} ${styles.nextButton}`}
               aria-label="Next"
            >
               <ArrowRight size={20} style={{ display: "block", margin: "auto" }} />
            </button>
         </div>
      </div>
   );
};

export default CarouselDiseases;
