import React, { useState } from "react";
import styles from "./Carousel.module.css";
import {ArrowLeft, ArrowRight} from "lucide-react";
import Image from "next/image";
import { diseases } from "@/data/diseases";

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
         <h2 className={styles.title}>Boli comune la câini și pisici, în funcție de rasă</h2>
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
                  width={400}
                  height={300}
                  style={{ objectFit: "cover" }}
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
