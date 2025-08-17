import {sendMessage} from "@/services/sessionService";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Layout from "@/components/Layout";
import styles from './Chat.module.css';
import {ArrowLeft} from 'lucide-react';
import LocateClinics from "@/components/LocateClinics";
import Authentication from "@/components/Authentication";

export default function ChatPage() {
   const router = useRouter();
   const {sessionId} = router.query;

   const [chatLog, setChatLog] = useState<any[]>([]);
   const [message, setMessage] = useState("");
   const [greeting, setGreeting] = useState("");
   const [loading, setLoading] = useState(false);
   const [finished, setFinished] = useState(false);

   useEffect(() => {
      const message = sessionStorage.getItem("greeting");
      if (message) {
         setGreeting(message);
         sessionStorage.removeItem("greeting");
      }
   }, []);

   useEffect(() => {
      if (greeting) {
         setChatLog([{sender: 'Gemini', text: greeting}]);
      }
   }, [greeting]);

   const handleSend = async () => {
      if (!sessionId || !message.trim() || loading || finished) return;

      setLoading(true);
      setChatLog((prev) => [...prev, {sender: 'Tu', text: message}]);

      try {
         const res = await sendMessage(Number(sessionId), message);

         const formattedReply = formatAIReply(res.reply);
         setChatLog((prev) => [...prev, {sender: 'Gemini', text: formattedReply}]);
         setMessage("");

         if (res.finished) {
            setFinished(true);
         }

      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const formatAIReply = (reply: string) => {
      const sections = reply.split(/(?=Diagnostic:|Tratament:|Recomandări:)/i);
      return sections.map((section, idx) => {

         if (section.includes('*')) {
            const parts = section.split('*').map((part, i) => {
               const trimmed = part.trim();
               if (!trimmed) return null;
               return <li key={i}>{trimmed}</li>;
            });
            return <div key={idx}><strong>{section.match(/^(.*?):/)?.[1]}:</strong><ul>{parts}</ul></div>;
         }
         return <p key={idx}>{section.trim()}</p>;
      });
   };


   return (
      <Layout>
         <Authentication>
            <div>
               <button
                  className={styles.backButton}
                  onClick={() => router.back()}
                  aria-label="Înapoi"
               >
                  <ArrowLeft size={20} style={{marginRight: '6px'}}/>
                  Înapoi
               </button>
            </div>

            <div className={styles.container}>
               <div className={styles.chatSection}>
                  <div className={styles.headerRow}>
                     <h2 className={styles.header}>Consultatie Live</h2>
                  </div>

                  <div className={styles.chatLog}>
                     {chatLog.map((msg, i) => (
                        <div
                           key={i}
                           className={msg.sender === 'Tu' ? styles.userMessage : styles.botMessage}
                        >
                           {msg.text}
                        </div>
                     ))}
                  </div>

                  <div className={styles.inputArea}>
                     <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Scrie mesajul tău..."
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                        disabled={finished}
                     />
                     <button onClick={handleSend} disabled={loading || finished}>
                        {loading ? 'Se trimite...' : finished ? 'Sesiune încheiată' : 'Trimite'}
                     </button>
                  </div>

                  {finished && (
                     <p className={styles.finishedNotice}>
                        Consultatia s-a încheiat. Pentru o altă evaluare, începe o nouă sesiune.
                     </p>
                  )}
               </div>

               <div className={styles.locateSection}>
                  <LocateClinics/>
               </div>
            </div>
         </Authentication>
      </Layout>
   );
}