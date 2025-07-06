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
            <div className="bg-gradient-to-br from-blue-50 to-green-50 homeBg">
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Sănătatea animalului tău, <span className="text-blue-600">prioritatea noastră</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Consultații cu AI, profiluri personalizate, diagnostic rapid și sfaturi utile pentru animalutul tau.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            <h2>Dashboard Sănătate Animale</h2>
                            <div className="w-full sm:w-72 bg-white shadow-md rounded-lg">
                                <div className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                                    <h3 className="text-sm font-medium">Consultații Totale</h3>
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="text-2xl font-bold">{consultationCount}</div>
                                </div>
                            </div>
                            <div className="w-full sm:w-72 bg-white shadow-md rounded-lg">
                                <div className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                                    <h3 className="text-sm font-medium">Animale Înregistrate</h3>
                                    <PawPrint className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="text-2xl font-bold">{animalCount}</div>
                                </div>
                            </div>
                            <div className="w-full sm:w-72 bg-white shadow-md rounded-lg">
                                <div className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                                    <h3 className="text-sm font-medium">Satisfacție Clienți</h3>
                                    <Heart className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="text-2xl font-bold">{reviewMean}</div>
                                </div>
                            </div>
                        </div>


                        <div className={styles.buttonContainer}>
                            <a href="/consultatii" className={styles.button}>
                                <Stethoscope className="h-5 w-5" />
                                Consultație AI
                            </a>
                            <a href="/create-animal-profile" className={styles.button2}>
                                Creează Profil Animal
                            </a>
                        </div>

                    </div>
                </section>
            </div>
        </>
    );
}
