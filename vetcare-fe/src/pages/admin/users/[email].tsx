import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Consultation} from "@/components/entities/consultation";
import axiosInstance from "@/utils/axiosInstance";
import {ChatSession} from "@/components/entities/chatSession";
import Swal from "sweetalert2";

export default function UserConsultations() {
   const router = useRouter();
   const {email} = router.query;

   const [consultations, setConsultations] = useState<Consultation[]>([]);
   const [sessions, setSessions] = useState<Record<number, ChatSession>>({});
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!email) return;
      let isMounted = true;

      async function fetchData() {
         try {
            const res = await axiosInstance.get<Consultation[]>("/api/admin/consultations");
            const userConsultations = res.data
            .filter(c => c.userEmail === email)
            .sort((a, b) => b.id - a.id);

            if (!isMounted) return;
            setConsultations(userConsultations);

            const sessionsMap: Record<number, ChatSession> = {};
            for (const c of userConsultations) {
               const sessionRes = await axiosInstance.get<ChatSession>(
                  `/api/admin/consultations/${c.id}/conversations`
               );
               console.log(sessionRes.data);
               sessionsMap[c.id] = sessionRes.data;
            }
            setSessions(sessionsMap);
         } catch (err) {
            console.error("Eroare la fetch:", err);
         } finally {
            if (isMounted) setLoading(false);
         }
      }

      fetchData();

      return () => {
         isMounted = false;
      };
   }, [email]);

   if (loading) return <p>Se încarcă...</p>;

   return (
      <div style={{padding: "20px"}}>
         <h1>Consultații pentru {email}</h1>
         {consultations.length === 0 && <p>Nicio consultație găsită.</p>}

         {consultations.map(c => (
            <div key={c.id} style={{border: "1px solid #ccc", marginBottom: "20px", padding: "10px"}}>

               <p>
                  Status:{" "}
                  {c.validated === true ? (
                     <span style={{color: "green", fontWeight: "bold"}}>✅ Validată</span>
                  ) : c.validated === false ? (
                     <span style={{color: "red", fontWeight: "bold"}}>❌ Invalidată</span>
                  ) : (
                     <span style={{color: "gray", fontWeight: "bold"}}>⏳ Nevalidată</span>
                  )}
               </p>


               <div style={{marginTop: "15px", background: "#f9f9f9", padding: "10px", borderRadius: "8px"}}>
                  <h3>Istoric conversație</h3>
                  {sessions[c.id] ? (
                     <div style={{marginBottom: "10px"}}>
                        <p>
                           <strong>Sesiune #{sessions[c.id].id}</strong>{" "}
                           {sessions[c.id].finished ? "✅ Finalizată" : "⏳ Activă"}
                        </p>
                        <pre
                           style={{
                              whiteSpace: "pre-wrap",
                              background: "#eee",
                              padding: "10px",
                              borderRadius: "5px"
                           }}
                        >
                    {sessions[c.id].conversationHistory}
                  </pre>
                     </div>
                  ) : (
                     <p><i>Nu există conversații pentru această consultație.</i></p>
                  )}
               </div>

               <div style={{marginTop: "10px"}}>
                  <button
                     style={{marginRight: "10px", background: "green", color: "white", padding: "5px 10px"}}
                     onClick={async () => {
                        try {
                           await axiosInstance.post(`/api/admin/consultations/${c.id}/validate`, {comment: "Validat corect"});
                           setConsultations(prev =>
                              prev.map(x => x.id === c.id ? {...x, validated: true, adminComment: ""} : x)
                           );
                           Swal.fire({icon: 'success', title: 'Consultația a fost validată!', showConfirmButton: true});
                        } catch (err) {
                           console.error(err);
                           Swal.fire({
                              icon: 'error',
                              title: 'Eroare la validare',
                              text: 'Nu s-a putut valida consultația'
                           });
                        }
                     }}
                  >
                     ✅ Validează
                  </button>

                  <button
                     style={{background: "red", color: "white", padding: "5px 10px"}}
                     onClick={async () => {
                        try {
                           await axiosInstance.post(`/api/admin/consultations/${c.id}/invalidate`, {comment: "Nu este corect"});
                           setConsultations(prev =>
                              prev.map(x => x.id === c.id ? {
                                 ...x,
                                 validated: false,
                                 adminComment: "Nu este corect"
                              } : x)
                           );
                           Swal.fire({
                              icon: 'warning',
                              title: 'Consultația a fost invalidată!',
                              showConfirmButton: true
                           });
                        } catch (err) {
                           console.error(err);
                           Swal.fire({
                              icon: 'error',
                              title: 'Eroare la invalidare',
                              text: 'Nu s-a putut invalida consultația'
                           });
                        }
                     }}
                  >
                     ❌ Invalidează
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
}
