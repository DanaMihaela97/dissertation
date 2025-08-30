import React, { useState } from "react";
import styles from "./Carousel.module.css";
import { diseases } from "@/data/diseases";
import {AlertTriangle, ChevronLeft, ChevronRight, Heart, Shield} from "lucide-react";
import Image from "next/image";

   export default function DiseaseCarousel() {
      const animals = Array.from(new Set(diseases.map(d => d.animal)))
      const [selectedAnimal, setSelectedAnimal] = useState(animals[0])
      const filteredDiseases = diseases.filter(d => d.animal === selectedAnimal)
      const [currentIndex, setCurrentIndex] = useState(0)
      const currentDisease = filteredDiseases[currentIndex]

      const prevSlide = () => {
         setCurrentIndex((prev) => (prev === 0 ? filteredDiseases.length - 1 : prev - 1))
      }

      const nextSlide = () => {
         setCurrentIndex((prev) => (prev === filteredDiseases.length - 1 ? 0 : prev + 1))
      }
      return (
         <>
            <div className={styles.header}>
               <h2>
                  <Heart className={styles.headerIcon}/>
                  Boli Specifice pe Rase
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


            <div className={styles.carouselWrapper}>
               <div className={styles.carouselSlide}>
                  <div className={styles.card}>

                     <div className={styles.cardContent}>
                        <div className={styles.animalInfo}>
                           <Image
                              src={currentDisease.image}
                              alt={currentDisease.animal}
                              width={500}
                              height={300}
                              className={styles.animalImage}
                           />
                           <div className={styles.animalText}>
                              <p className={styles.subTitle}>
                                 {currentDisease.name}
                              </p>

                              <div className={styles.tagRow}>
                                 <span className={styles.animalTag}>{currentDisease.animal}</span>
                                 <span className={`${styles.breedTag} ${currentDisease.animal === 'Pisici' ? styles.red : styles.gray}`}>
                                {currentDisease.breed}
                              </span>
                              </div>
                           </div>
                        </div>


                        <div className={styles.twoColumns}>
                           <div className={`${styles.cardSection} ${styles.orange}`}>
                              <AlertTriangle className={styles.alertIcon}/>
                              <div>
                                 <p>Simptome</p>
                                 <ul>
                                    {currentDisease.symptoms.map((s, i) => (
                                       <li key={i}>{s}</li>
                                    ))}
                                 </ul>
                              </div>
                           </div>

                           <div className={`${styles.cardSection} ${styles.green}`}>
                              <Shield className={styles.shieldIcon}/>
                              <div>
                                 <p>Prevenire</p>
                                 <ul>
                                    {currentDisease.prevention.map((p, i) => (
                                       <li key={i}>{p}</li>
                                    ))}
                                 </ul>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {filteredDiseases.length > 1 && (
                  <>
                     <button
                        className={`${styles.navButton} ${styles.prevButton}`}
                        onClick={prevSlide}
                     >
                        <ChevronLeft size={20} />
                     </button>

                     <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={nextSlide}
                     >
                        <ChevronRight size={20} />
                     </button>
                  </>
               )}
            </div>

            {filteredDiseases.length > 1 && (
               <div className={styles.carouselIndicators}>
                  {filteredDiseases.map((_, i) => (
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