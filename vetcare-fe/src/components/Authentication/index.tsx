"use client"

import React, {useEffect} from 'react'
import {signIn, useSession} from "next-auth/react";

const Authentication = ({children}) => {
   const {data: session} = useSession();

   useEffect(() => {
      if (session?.error !== "RefreshTokenError") return
      signIn("keycloak")
   }, [session?.error])

   if (session) {
      return (
         <>
            {/*<Sse />*/}
            <main>{children}</main>
         </>
      )
   }
   return null;
}
export default Authentication
