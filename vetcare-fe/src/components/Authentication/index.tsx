"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

const Authentication
   = ({ children,
         hideIfUnauthenticated = false,
         response = "Nu ai acces la această pagină"}) => {
   const { data: session, status } = useSession();

   // Handle refresh token errors automatically
   useEffect(() => {
      if (session?.error === "RefreshTokenError") {
         signIn("keycloak");
      }
   }, [session?.error]);

   // Loading state
   if (status === "loading") {
      return hideIfUnauthenticated ? null : <p>Se verifică autentificarea...</p>;
   }

   // Unauthenticated state
   if (status === "unauthenticated") {
      if (hideIfUnauthenticated) {
         return null;
      }
      return (
         <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{response}</h2>
            <p>Te rugăm să te autentifici pentru a continua.</p>
            <button
               style={{
                  padding: "10px 20px",
                  background: "#3085d6",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
               }}
               onClick={() => signIn("keycloak")}
            >
               Autentificare
            </button>
         </div>
      );
   }

   // Authenticated state
   return <main>{children}</main>;
};

export default Authentication;
