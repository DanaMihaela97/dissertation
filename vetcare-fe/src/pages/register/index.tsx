import React, {useState} from "react";
import Swal from "sweetalert2";
import {useRouter} from "next/router";
import styles from './Register.module.css';
import Layout from "@/components/Layout";
import {register} from "@/services/registerService";
import {subscribeToNotifications} from "@/services/snsService";

const RegisterPage = () => {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");

   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      if (!email || !password) {
         setError("Email și parola sunt obligatorii!");
         setLoading(false);
         return;
      }

      try {
         await register({ email, password, firstName, lastName });

         await subscribeToNotifications(email);

         Swal.fire({
            title: "Înregistrare reușită!",
            html: `
            <p>Te poți loga acum.</p>
            <p style="margin-top:10px; font-size:14px; color:gray;">
               📧 Am trimis și un email de confirmare pentru notificări.<br/>
               Te rugăm să îl verifici pentru a putea primi alertele PawCare.
            </p>
         `,
            icon: "success",
            timer: 4000,
            timerProgressBar: true,
            showConfirmButton: false,
         }).then(() => {
            router.push("/login");
         });

      } catch (err: any) {
         console.error(err);

         if (err.response?.status === 409) {
            setError("Email-ul este deja folosit!");
         } else {
            setError("A apărut o eroare la înregistrare. Încearcă din nou.");
         }

         Swal.fire({
            title: "Eroare",
            text: error || "A apărut o eroare la înregistrare.",
            icon: "error",
            confirmButtonText: "OK",
         });
      } finally {
         setLoading(false);
      }
   };

   return (
      <Layout>
         <div className={styles.registerContainer}>
            <div className={styles.registerForm}>
               <h2 className={styles.registerHeading}>Înregistrare</h2>
               <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                     <label htmlFor="firstName">Prenume</label>
                     <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                     />
                  </div>

                  <div className={styles.formGroup}>
                     <label htmlFor="lastName">Nume</label>
                     <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                     />
                  </div>

                  <div className={styles.formGroup}>
                     <label htmlFor="email">Email</label>
                     <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>

                  <div className={styles.formGroup}>
                     <label htmlFor="password">Parola</label>
                     <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className={styles.submitButton}
                  >
                     Înregistrează-te
                  </button>
               </form>

               <button
                  type="button"
                  className={styles.alreadyAccountButton}
                  onClick={() => router.push("/login")}
                  disabled={loading}
               >
                  Am deja cont
               </button>

               {error && <p className={styles.error}>{error}</p>}
            </div>
         </div>
      </Layout>
   );
};

export default RegisterPage;
