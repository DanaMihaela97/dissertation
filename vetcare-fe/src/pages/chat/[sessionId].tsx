import {sendMessage} from "@/services/sessionService";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Layout from "@/components/Layout";
import styles from './Chat.module.css';
import { ArrowLeft } from 'lucide-react';
import LocateClinics from "@/components/LocateClinics";

export default function ChatPage() {
   const router = useRouter();
   const {sessionId, botMessage} = router.query;

   const [chatLog, setChatLog] = useState<string[]>([]);
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (botMessage && typeof botMessage === "string") {
         setChatLog([`Gemini: ${botMessage}`]);
      }
   }, [botMessage]);

   const handleSend = async () => {
      if (!sessionId || !message.trim() || loading) return;

      setLoading(true);
      setChatLog((prev) => [...prev, `Tu: ${message}`]);

      try {
         const res = await sendMessage(Number(sessionId), message);
         setChatLog((prev) => [...prev, `Gemini: ${res.reply}`]);
         setMessage("");
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Layout>
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
                  {chatLog.map((msg, i) => {
                     const isUser = msg.startsWith('Tu:');
                     const text = msg.replace(/^(Tu: |Gemini: )/, '');
                     return (
                        <p
                           key={i}
                           className={isUser ? styles.userMessage : styles.botMessage}
                        >
                           {text}
                        </p>
                     );
                  })}
               </div>

               <div className={styles.inputArea}>
                  <input
                     type="text"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     placeholder="Scrie mesajul tău..."
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSend();
                     }}
                  />
                  <button onClick={handleSend} disabled={loading}>
                     {loading ? 'Se trimite...' : 'Trimite'}
                  </button>
               </div>
            </div>

            <div className={styles.locateSection}>


           <LocateClinics />
            </div>
         </div>
      </Layout>
   );
}