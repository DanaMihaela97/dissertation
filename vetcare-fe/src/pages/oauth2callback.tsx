// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import { ClockLoader } from 'react-spinners';
// import {useSession} from "next-auth/react";
//
// export default function OAuth2Callback() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const { data: session } = useSession();
//
//   useEffect(() => {
//     let token = new URLSearchParams(window.location.search).get('token');
//
//     if (token) {
//       token = session.accessToken;
//
//       setTimeout(() => {
//         router.replace('/consultatii');
//       }, 1000);
//
//       setTimeout(() => {
//         setLoading(false);
//       }, 1000);
//     } else {
//       console.error("Tokenul nu a fost găsit în URL!");
//     }
//   }, [router]);
//
//   return (
//     <div className="callback-container">
//       {loading ? (
//         <div className="spinner-container">
//           <ClockLoader color={"#0066cc"} loading={true} size={50} />
//           <p className="loading-text">Se finalizează autentificarea...</p>
//         </div>
//       ) : null}
//
//       <style jsx>{`
//         /* Container principal pentru pagina de callback */
//         .callback-container {
//           display: flex;
//           justify-content: center;  /* Centrează pe orizontală */
//           align-items: center;      /* Centrează pe verticală */
//           height: 100vh;            /* Înălțimea totală a ferestrei */
//           background-color: #f5f5f5;
//           font-family: Arial, sans-serif;
//           margin: 0;
//         }
//
//         /* Container pentru spinner și text */
//         .spinner-container {
//           text-align: center;
//           padding: 20px;
//           background-color: #ffffff;
//           border-radius: 10px;
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           align-items: center;
//         }
//
//         /* Textul care apare sub spinner */
//         .loading-text {
//           margin-top: 20px;
//           font-size: 18px;
//           color: #333;
//           font-weight: 600;
//         }
//       `}</style>
//     </div>
//   );
// }
