import React from 'react';
import {ArrowRight, LogIn} from 'lucide-react';
import {signIn} from 'next-auth/react';
import styles from './Login.module.css';
import Layout from "@/components/Layout";


const LoginPage = () => {

   return (
      <Layout>
         <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
               <div className={styles.iconWrapper}>
                  <LogIn className="w-6 h-6"/>
               </div>
               <h1 className={styles.loginHeading}>Bine ai venit!</h1>
               <p className={styles.loginText}>Autentifică-te cu contul tău Keycloak pentru a accesa aplicația.</p>

               <button
                  onClick={() => signIn("keycloak")}
                  className={styles.keycloakButton}
               >
                  <span>Autentifică-te cu Keycloak</span>
                  <ArrowRight className={styles.arrow}/>
               </button>
            </div>
         </div>
      </Layout>
   );
};

export default LoginPage;
