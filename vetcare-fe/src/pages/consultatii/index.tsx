import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar'; 
import Link from 'next/link';              
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function ConsultatiiVeterinare() {
  const router = useRouter();
   const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
           const jwt = localStorage.getItem('jwt');
           if (jwt) {
   
               setLoggedIn(true);
   
           } else {
               setLoggedIn(false);
               localStorage.removeItem('jwt')
           }
       }, []);

   useEffect(() => {
          const handleStorageChange = () => {
              const jwt = localStorage.getItem('jwt');
              setLoggedIn(!!jwt);
          };
  
          window.addEventListener('storage', handleStorageChange);
  
          return () => {
              window.removeEventListener('storage', handleStorageChange);
          };
      }, []);
  

  const handleConsultationClick = () => {
    if (!loggedIn) {
      Swal.fire({
        icon: 'error',
        title: 'Autentificare necesară',
        text: 'Trebuie să te autentifici pentru a începe o consultație.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } else {
      router.push('/chat'); 
    }
  };

  return (
   <>
      <Navbar />  
      <div className="container">
      <section className="hero">
        <h1>Consultații Veterinare Online</h1>
        <p className="hero-description">
          Obține diagnostic și recomandări pentru animalul tău de companie direct de acasă, cu ajutorul inteligenței
          artificiale.
        </p>
        <Link href="/chat" className="cta-button" onClick={handleConsultationClick}>
            Începe o consultație
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <Image src="/examination.png" alt="Stethoscope" width={66} height={66} />
          </div>
          <h3>Diagnostic AI</h3>
          <p>Diagnostic preliminar bazat pe simptomele și istoricul medical al animalului tău</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Image src="/band-aid.png" alt="Stethoscope" width={60} height={60} />
          </div>
          <h3>Recomandări Tratament</h3>
          <p>Recomandări personalizate pentru tratament și îngrijire</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Image src="/bell.png" alt="Stethoscope" width={60} height={60} />
          </div>
          <h3>Memento-uri Automate</h3>
          <p>Memento-uri pentru administrarea medicamentelor și programări</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Image src="/pin.png" alt="Stethoscope" width={60} height={60} />
          </div>
          <h3>Clinici Apropiate</h3>
          <p>Recomandări de clinici veterinare din zona ta</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>Cum funcționează</h2>
        <p className="section-description">Obține un diagnostic preliminar și recomandări în doar 3 pași simpli</p>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Completează formularul</h3>
            <p>Introdu informațiile despre animalul tău și descrie simptomele observate</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Primește diagnostic</h3>
            <p>Sistemul nostru AI analizează datele și oferă un diagnostic preliminar</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Urmează recomandările</h3>
            <p>Primești recomandări de tratament și memento-uri pentru administrarea medicamentelor</p>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <Link href="/anamneza" className="cta-button">
            Începe o consultație acum
        </Link>
      </section>
    </div>
   </>
  );
}
