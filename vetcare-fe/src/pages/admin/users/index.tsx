"use client";

import { Consultation } from "@/components/entities/consultation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Authentication from "@/components/Authentication";
import axiosInstance from "@/utils/axiosInstance";
import {getSession} from "next-auth/react";
import {Session} from "next-auth";
import jwtDecode from "jwt-decode";

interface KeycloakToken {
   realm_access?: { roles: string[] };
}

interface UserEmail {
   userEmail: string;
}

const AdminUsersPage = () => {
   const [users, setUsers] = useState<UserEmail[]>([]);
   const [loading, setLoading] = useState(true);
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      async function fetchUsers() {
         const session = (await getSession()) as Session & { accessToken?: string };

         if (session?.accessToken) {
            // verifică rolul admin
            if (session?.roles?.includes("admin")) {
               setIsAdmin(true);

               try {
                  // folosește endpoint-ul care returnează doar email-urile
                  const res = await axiosInstance.get<string[]>("/api/admin/consultations/users");

                  // construiește array-ul de UserEmail
                  const uniqueUsers = res.data.map(email => ({ userEmail: email }));
                  setUsers(uniqueUsers);

               } catch (err) {
                  console.error("Eroare la preluarea utilizatorilor:", err);
               }
            }
         }

         setLoading(false);
      }

      fetchUsers();
   }, []);


   if (loading) return <p>Se încarcă...</p>;
   if (!isAdmin) return <p>Nu ai permisiunea de a accesa această pagină.</p>;

   return (
      <Authentication>
         <h1>Lista utilizatorilor</h1>
         {users.length === 0 ? (
            <p>Nu există utilizatori.</p>
         ) : (
            <ul>
               {users.map(user => (
                  <li key={user.userEmail}>
                     <Link href={`/admin/users/${encodeURIComponent(user.userEmail)}`}>
                        {user.userEmail}
                     </Link>
                  </li>
               ))}
            </ul>
         )}
      </Authentication>
   );

};

export default AdminUsersPage;
