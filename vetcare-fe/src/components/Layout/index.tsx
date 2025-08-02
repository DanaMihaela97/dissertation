import React from 'react'
import Navbar from "@/components/Navbar";
import Sse from "@/components/Sse";

// const Layout = ({children}) => {
//
//     return (
//         <>
//             <Navbar />
//             <Authentication />
//             {children}
//         </>
//     )
// }
// export default Layout

export default function Layout({children}) {
   return (
      <>
         <Navbar/>
         <Sse/>
         <main>{children}</main>
      </>
   )
}