
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Stethoscope, Heart, PawPrint, Activity } from "lucide-react";
import { getAnimalCount } from "@/services/animalService";
import styles from "./home.module.css";
import { getConsultationCount, getReviewMean } from "@/services/reviewService";

export default function Home() {
    const [animalCount, setAnimalCount] = useState(null);
    const [consultationCount, setConsultationCount] = useState(null);
    const [reviewMean, setReviewMean] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const animalData = await getAnimalCount();
                const consultationData = await getConsultationCount();
                const reviewData = await getReviewMean();

                console.log(animalCount);
                setAnimalCount(animalData);
                setConsultationCount(consultationData);
                setReviewMean(reviewData);
            } catch (error) {
                console.error("eroare la incarcarea datelor:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    return (
        <>
            <Navbar />
            <div className={`bg-gradient-to-br from-blue-50 to-green-50 ${styles.topDiv}`}>
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className={styles.headerText}>
                            Sănătatea animalului tău, <span className={styles.text}>prioritatea <br />noastră</span>
                        </h1>

                        <p className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto ${styles.textParagraph}`}>
                            Consultații cu AI, profiluri personalizate, diagnostic rapid și sfaturi <br />utile pentru animalutul tau.
                        </p>
                        <div className={styles.buttonContainer}>
                            <a href="/consultatii" className={styles.button}>
                                <Stethoscope className="h-5 w-5" />
                                Afla mai multe despre serviciile noastre
                            </a>
                            <a href="/register" className={styles.button2}>
                                Conecteaza-te pentru a incepe
                            </a>
                        </div>

                        <div className={styles.dashboard}>
                            <h2 className="text-2xl font-bold mb-6">Dashboard Sănătate Animale</h2>

                            <div className={styles.cardContainer}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>Consultații Totale</h3>
                                        <Activity className={styles.cardIcon} style={{ color: '#3b82f6' }} />
                                    </div>
                                    <div className={styles.cardNumber}>{consultationCount}</div>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>Animale Înregistrate</h3>
                                        <PawPrint className={styles.cardIcon} style={{ color: '#10b981' }} />
                                    </div>
                                    <div className={styles.cardNumber}>{animalCount}</div>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>Satisfacție Clienți</h3>
                                        <Heart className={styles.cardIcon} style={{ color: '#ef4444' }} />
                                    </div>
                                    <div className={styles.cardNumber}>{reviewMean}</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <div className={styles.darkBlueBanner}>
                    <h2>Începe să îți îngrijești animalul mai bine astăzi</h2>
                    <p>Alătură-te comunității PawCare și oferă animalului tău cea mai bună îngrijire medicală.</p>
                </div>
            </div>
        </>
    );
}
