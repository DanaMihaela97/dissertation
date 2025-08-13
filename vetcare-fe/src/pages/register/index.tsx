import React, {useState} from "react";
import Swal from "sweetalert2";
import {useRouter} from "next/router";
import styles from './Register.module.css';
import Layout from "@/components/Layout";

const RegisterPage = () => {
   const router = useRouter();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
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
         Swal.fire({
            title: "Înregistrare reușită!",
            text: "Te poți loga acum.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
         }).then(() => {
            router.push("/login");
         });

      } catch (err) {
         console.error(err);
         Swal.fire({
            title: "Eroare",
            text: "A apărut o eroare la înregistrare. Încearcă din nou.",
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

                  <button type="submit" disabled={loading} className={styles.submitButton}>
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
