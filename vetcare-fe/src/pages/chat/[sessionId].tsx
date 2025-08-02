import Navbar from "@/components/Navbar";
import {sendMessage} from "@/services/sessionService";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Layout from "@/components/Layout";

export default function ChatPage() {
   const router = useRouter();
   const {sessionId, botMessage} = router.query;

   const [chatLog, setChatLog] = useState<string[]>([]);
   const [message, setMessage] = useState("");

   useEffect(() => {
      if (botMessage && typeof botMessage === "string") {
         console.log(botMessage)
         setChatLog([`Gemini: ${botMessage}`]);
      }
   }, [botMessage]);

   const handleSend = async () => {
      if (!sessionId || !message.trim()) return;
      try {
         const res = await sendMessage(Number(sessionId), message);
         setChatLog((prev) => [...prev, `Tu: ${message}`, `Gemini: ${res.reply}`]);
         setMessage("");
      } catch (err) {
         console.error("Eroare la trimitere mesaj:", err);
      }
   };

   return (
      <Layout>
         <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Consultatie Live</h2>
            <div className="space-y-2 mb-4">
               {chatLog.map((msg, i) => (
                  <p key={i} className="bg-gray-100 p-2 rounded">{msg}</p>
               ))}
            </div>
            <div className="flex gap-2">
               <input
                  type="text"
                  className="border p-2 flex-grow"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Scrie mesajul tău..."
               />
               <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleSend}
               >
                  Trimite
               </button>
            </div>
         </div>
      </Layout>
   );
}
