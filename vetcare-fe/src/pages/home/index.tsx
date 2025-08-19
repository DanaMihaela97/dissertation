import React, {useEffect, useState} from "react";
import {Stethoscope, PawPrint, Activity, ArrowBigDown} from "lucide-react";
import {getAnimalCount} from "@/services/animalService";
import styles from "./Home.module.css";
import {getConsultationCount, getReviewMean} from "@/services/reviewService";
import Layout from "@/components/Layout";
import StarRating from "@/components/StarRating";
import CarouselDiseases from "@/components/Carousel";
import Link from "next/link";

export default function Home() {
   const [animalCount, setAnimalCount] = useState(null);
   const [consultationCount, setConsultationCount] = useState(null);
   const [reviewMean, setReviewMean] = useState(null);

   useEffect(() => {
      async function fetchData() {
         try {
            const animalData = await getAnimalCount();
            const consultationData = await getConsultationCount();
            const reviewData = await getReviewMean();

            setAnimalCount(animalData);
            setConsultationCount(consultationData);
            setReviewMean(reviewData);

            console.log(animalData);
         } catch (error) {
            console.error("eroare la incarcarea datelor:", error);
         }
      }

      fetchData();
   }, []);



   return (
      <Layout>
         <div className={`bg-gradient-to-br from-blue-50 to-green-50 ${styles.topDiv}`}>
            <section
               className={`relative flex flex-col items-center justify-center min-h-[85vh] w-full text-center px-4 ${styles.heroSection}`}>
               <div className="max-w-4xl mx-auto">
                  <h1 className={styles.headerText}>
                     Sănătatea animalului tău, <span className={styles.text}>prioritatea <br/>noastră</span>
                  </h1>

                  <p className={`text-xl text-gray-600 mt-6 mb-8 ${styles.textParagraph}`}>
                     Consultații cu AI, profiluri personalizate, diagnostic rapid și sfaturi <br/>utile pentru
                     animaluțul tău.
                  </p>

                  <div className={styles.buttonContainer}>
                     <Link href="/services" className={styles.button}>
                        <Stethoscope className="h-5 w-5"/>
                        Află mai multe despre serviciile noastre
                     </Link>

                     <Link href="/register" className={styles.button2}>
                        Conectează-te pentru a începe
                     </Link>
                  </div>
               </div>
               <div className={styles.scrollContainer}>
                  <p className={styles.scrollTitle}>Apasă aici pentru a vedea cele mai comune boli, în funcție de rasă
                  </p>
                  <a href="#next-section" className={styles.scrollArrow}>
                     <ArrowBigDown size={48} strokeWidth={1.5}/>
                  </a>
               </div>

            </section>

            <div id="next-section">
               <CarouselDiseases/>

               <div className={styles.dashboard}>
                  <h2 className={styles.h2monitoring}>Monitorizare Activitate - situație curentă</h2>
                  <div className={styles.cardContainer}>
                     <div className={styles.card}>
                        <div className={styles.cardHeader}>
                           <h3 className={styles.cardTitle}>Consultații Totale</h3>
                           <Activity className={styles.cardIcon} style={{color: '#3b82f6'}}/>
                        </div>
                        <div className={styles.cardNumber}>{consultationCount}</div>
                     </div>
                     <div className={styles.card}>
                        <div className={styles.cardHeader}>
                           <h3 className={styles.cardTitle}>Animale Înregistrate</h3>
                           <PawPrint className={styles.cardIcon} style={{color: '#10b981'}}/>
                        </div>
                        <div className={styles.cardNumber}>{animalCount}</div>
                     </div>
                  </div>
               </div>

               <div className={styles.darkBlueBanner}>
                  <h2>Începe să îți îngrijești animalul mai bine astăzi</h2>
                  <p>Alătură-te comunității PawCare și oferă animalului tău cea mai bună îngrijire medicală.</p>
               </div>

               <div className={styles.customerSatisfactionBox}>
                  <h3 className={styles.customerSatisfactionTitle}>Satisfacția Clienților</h3>
                  <StarRating rating={reviewMean || 0}/>
                  <div className={styles.customerSatisfactionScore}>
                     {reviewMean ? reviewMean.toFixed(1) : '0'}/5
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   );
}
