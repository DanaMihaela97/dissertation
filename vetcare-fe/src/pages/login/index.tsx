import React, { useEffect } from 'react';
import { ArrowRight, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {signIn, useSession} from 'next-auth/react';
import axios from 'axios';
import styles from './Login.module.css';


const LoginPage = () => {
  const { data: session } = useSession();
  useEffect(() => {
    const setCookie = async () => {
      if (session?.accessToken) {
        await axios.get('/api/set-cookie');
        console.log('JWT cookie set successfully');
      }
    };

    setCookie();
  }, [session]);
  if (session) {
    if (typeof window !== 'undefined') {
      localStorage.setItem("jwt", session.accessToken as string);
      console.log(localStorage.getItem("jwt"));
    }
  }

  return (
      <>
        <Navbar />
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.iconWrapper}>
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className={styles.loginHeading}>Bine ai venit!</h1>
            <p className={styles.loginText}>Autentifică-te cu contul tău Keycloak pentru a accesa aplicația.</p>

            <button
                onClick={() => signIn()}
                className={styles.keycloakButton}
            >
              <span>Autentifică-te cu Keycloak</span>
              <ArrowRight className={styles.arrow} />
            </button>
          </div>
        </div>
      </>
  );
};

export default LoginPage;
