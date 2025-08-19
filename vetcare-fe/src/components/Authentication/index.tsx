"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";
import styles from "./Authentication.module.css"

interface SessionWithError extends Session {
   error?: "RefreshTokenError";
}

const Authentication
   = ({ children,
         hideIfUnauthenticated = false,
         response = "Nu ai acces la această pagină"}) => {
   const { data: session, status } = useSession() as { data: SessionWithError | null; status: string };

   useEffect(() => {
      if (session?.error === "RefreshTokenError") {
         signIn("keycloak");
      }
   }, [session?.error]);

   if (status === "loading") {
      return hideIfUnauthenticated ? null : <p>Se verifică autentificarea...</p>;
   }

   if (status === "unauthenticated") {
      if (hideIfUnauthenticated) {
         return null;
      }
      return (
         <div className={styles.authContainer}>
            <h2>{response}</h2>
            <p>Te rugăm să te autentifici pentru a continua.</p>
            <button
               className={styles.loginButton}
               onClick={() => signIn("keycloak")}
            >
               Autentificare
            </button>
         </div>
      );
   }

   return <main>{children}</main>;
};

export default Authentication;
