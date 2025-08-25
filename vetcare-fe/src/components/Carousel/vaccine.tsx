import styles from "./Carousel.module.css";
import {ChevronLeft, ChevronRight, Clock, Info, Syringe} from "lucide-react";
import { useState } from "react";
import {vaccines} from "@/data/vaccines";


export default function VaccineCarousel() {
   const animals = Array.from(new Set(vaccines.map(v => v.animal)));
   const [selectedAnimal, setSelectedAnimal] = useState(animals[0]);
   const [currentIndex, setCurrentIndex] = useState(0);

   const filteredVaccines = vaccines.filter(
      v => v.animal === selectedAnimal && v.type === "Vaccin"
   );

   const currentVaccine = filteredVaccines[currentIndex];


   const prevSlide = () => {
      setCurrentIndex(prev => (prev === 0 ? filteredVaccines.length - 1 : prev - 1));
   };

   const nextSlide = () => {
      setCurrentIndex(prev => (prev === filteredVaccines.length - 1 ? 0 : prev + 1));
   };


   return (
      <>
         <div className={styles.header}>
            <h2>
               <Syringe className={styles.headerIcon}/>
               Vaccinuri pentru Animale
            </h2>
            <div className={styles.buttonGroup}>
               {animals.map(animal => (
                  <button
                     key={animal}
                     className={`${styles.animalButton} ${selectedAnimal === animal ? styles.active : ''}`}
                     onClick={() => {
                        setSelectedAnimal(animal);
                        setCurrentIndex(0);
                     }}
                  >
                     {animal}
                  </button>
               ))}
            </div>

         </div>
         <div className={styles.carouselContainer}>

            <div className={styles.carouselOuterWrapper}>
            <div className={styles.carouselWrapper}>
               <div className={styles.carouselSlide}>
                  <div className={styles.card}>
                     <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>{currentVaccine.name}</h3>

                        <div className={styles.intro}>
                           {vaccines.find(v => v.intro && v.animal === currentVaccine.animal)?.intro}
                        </div>
                     </div>

                     <div className={`${styles.cardContent} ${styles.twoColumns}`}>
                        <div className={`${styles.cardSection} ${styles.green}`}>
                           <Syringe className={styles.sectionIcon}/>
                           <div>
                              <p>Doze necesare</p>
                              <p>{currentVaccine.doses}</p>
                           </div>
                        </div>

                        <div className={`${styles.cardSection} ${styles.red}`}>
                           <Clock className={styles.sectionIcon}/>
                           <div>
                              <p>Interval</p>
                              <p>{currentVaccine.interval}</p>
                           </div>
                        </div>
                     </div>

                     <div className={styles.cardContent}>
                        <div className={`${styles.cardSection} ${styles.blue} ${styles.infoSection}`}>
                           <Info className={styles.sectionIcon}/>
                           <div>
                              <p>Informații importante</p>
                              <p>{currentVaccine.info}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {filteredVaccines.length > 1 && (
                  <>
                     <button
                        className={`${styles.navButton} ${styles.prevButton}`}
                        onClick={prevSlide}
                     >
                        <ChevronLeft size={24} />
                     </button>

                     <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={nextSlide}
                     >
                        <ChevronRight size={24} />
                     </button>
                  </>
               )}
            </div>
            </div>
            {filteredVaccines.length > 1 && (
               <div className={styles.carouselIndicators}>
                  {filteredVaccines.map((_, i) => (
                     <div
                        key={i}
                        className={`${styles.indicator} ${i === currentIndex ? styles.active : ''}`}
                        onClick={() => setCurrentIndex(i)}
                     />
                  ))}
               </div>
            )}
         </div>
      </>
   );
}
