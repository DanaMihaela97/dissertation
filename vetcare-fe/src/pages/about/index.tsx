import Navbar from "@/components/Navbar";
import { PawPrintIcon as Paw, Calendar, MessageCircle, Star, MapPin, Shield } from "lucide-react"
import styles from './About.module.css';
const About = () => {

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.titleSection}>
                    <h1>Despre PawCare</h1>
                </div>

                <div className={styles.prose}>
                    <p>
                        PawCare a fost creată din pasiunea pentru animale și dorința de a oferi stăpânilor de animale de companie un
                        instrument pentru a-și îngriji mai bine prietenii blănoși. Înțelegem că animalele de companie sunt
                        membri ai familiei, iar sănătatea și bunăstarea lor sunt prioritare.
                    </p>
                    <p>
                        Aplicația noastră îți permite să creezi profile personalizate pentru fiecare animal de companie, să
                        monitorizezi programul de vaccinare, să primești sfaturi de la AI-ul nostru specializat în medicină veterinară și să găsești rapid cele mai
                        apropiate cabinete veterinare în caz de urgență.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-teal-700 mb-8 text-center">Ce oferă PawCare?</h2>

                <div className={styles.featureGrid}>
                    <FeatureCard
                        icon={<Paw className="h-8 w-8" />}
                        title="Profile pentru animăluțe"
                        description="Creează profile personalizate pentru fiecare animal de companie, cu informații despre rasă, vârstă, greutate și altele."
                    />
                    <FeatureCard
                        icon={<Calendar className="h-8 w-8" />}
                        title="Monitorizare vaccinuri"
                        description="Primește notificări pentru următoarele vaccinuri."
                    />
                    <FeatureCard
                        icon={<MessageCircle className="h-8 w-8" />}
                        title="Consultanță chat"
                        description="Consultă-te cu AI-ul nostru specializat în medicină veterinară atunci când animalul tău are o problemă minoră sau ai nevoie de sfaturi."
                    />
                    <FeatureCard
                        icon={<Star className="h-8 w-8" />}
                        title="Recenzii și feedback"
                        description="Lasă recenzii pentru serviciile veterinare și oferă-ne feedback pentru a îmbunătăți constant aplicația."
                    />
                    <FeatureCard
                        icon={<MapPin className="h-8 w-8" />}
                        title="Cabinete apropiate"
                        description="Găsește rapid cele mai apropiate cabinete veterinare."
                    />
                   
                </div>

                <div className={styles.missionContainer}>
                    <h2 className={styles.missionTitle}>Misiunea noastră</h2>
                    <p className={styles.missionText}>
                        <Paw size={20} color="#0f766e" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        La PawCare, misiunea noastră este să facem îngrijirea animalelor de companie mai ușoară, mai accesibilă și
                        mai eficientă. Credem că fiecare animal merită cea mai bună îngrijire, iar fiecare stăpân merită liniștea că
                        face tot ce poate pentru prietenul său blănos.
                    </p>
                    <p className={styles.missionText}>
                        <Paw size={20} color="#0f766e" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Dezvoltăm constant aplicația noastră bazându-ne pe feedback-ul utilizatorilor și pe cele mai recente
                        cercetări în domeniul îngrijirii animalelor. Alătură-te comunității PawCare și oferă-i animalului tău de
                        companie îngrijirea pe care o merită!
                    </p>

                </div>
            </div>
        </>
    )
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className={styles.featureCard}>
            <div className={styles.featureIcon}>{icon}</div>
            <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDescription}>{description}</p>
            </div>
        </div>
    );
}

export default About;