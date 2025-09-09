import { useEffect, useState } from 'react';
import styles from './Sse.module.css';
import { getEventSourcePath } from "@/services/sseService";
import Authentication from "@/components/Authentication";
import { useSession } from "next-auth/react";
import {Bell} from "lucide-react";

type Notification = {
    message: string;
    receivedAt: Date;
};

export default function Sse() {
    const [hasNotification, setHasNotification] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { data: session } = useSession();
    useEffect(() => {
        if (!session?.user?.email) return;

        const saved = localStorage.getItem(`notifications_${session.user.email}`);
        if (saved) {
            const parsed: Notification[] = JSON.parse(saved).map((n: Notification) => ({
                ...n,
                receivedAt: new Date(n.receivedAt),
            }));
            setNotifications(parsed);
        }
    }, [session?.user?.email]);



    useEffect(() => {
        if (session?.user?.email) {
            document.cookie = `email=${encodeURIComponent(session.user.email)}; path=/; SameSite=Lax`;
        }

        const eventSource = new EventSource(getEventSourcePath(), { withCredentials: true });

        eventSource.onopen = () => console.log('SSE connected');

        eventSource.addEventListener('vaccine-update', (event) => {
            const newNotification: Notification = {
                message: event.data,
                receivedAt: new Date(),
            };

            setHasNotification(true);
            setNotifications((prev) => {
                const updated = [newNotification, ...prev];
                localStorage.setItem(`notifications_${session.user.email}`, JSON.stringify(updated));
                return updated;
            });

            setShowPopup(true);
            // new Audio('/notification.mp3').play();
            setTimeout(() => setShowPopup(false), 4000);
        });

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            eventSource.close();
        };

        return () => eventSource.close();
    }, [session?.user?.email]);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        setHasNotification(false);
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleString();
    };

    return (
       <Authentication hideIfUnauthenticated={true}>
           <div className={styles.notificationContainer}>
               {showPopup && (
                  <div className={styles.popupMessage}>
                      <Bell className={styles.bellIconPopup} />
                      Ai primit o notificare
                  </div>
               )}
               {isOpen && (
                  <div className={styles.notificationDropdown}>
                      {notifications.length === 0 && <div>Nu ai notificări</div>}
                      {notifications.map((notif, index) => (
                         <div
                            key={index}
                            className={`${styles.notificationItem} ${index === 0 ? styles.latestNotification : ''}`}
                         >
                             <div>{notif.message}</div>
                             <small>{formatDateTime(notif.receivedAt)}</small>
                         </div>
                      ))}
                  </div>
               )}
               <button
                  className={`${styles.bellButton} ${hasNotification ? styles.hasNotification : ''}`}
                  onClick={handleBellClick}
               >
                   <Bell className={styles.bellIconButton} />
                   {hasNotification && <span className={styles.notificationDot}></span>}
               </button>
           </div>
       </Authentication>
    );
}
