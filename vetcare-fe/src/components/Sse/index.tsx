'use client'
import { useEffect, useState} from 'react';
import styles from './Sse.module.css';
import { getEventSourcePath, } from "@/services/sseService";
import Authentication from "@/components/Authentication";
import {useSession} from "next-auth/react";


export default function Sse() {
    const [hasNotification, setHasNotification] = useState(false);
    const [latestUpdate, setLatestUpdate] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const {data: session} = useSession();

    useEffect(() => {
        if (session?.user?.email) {
            document.cookie = `email=${encodeURIComponent(session.user.email)}; path=/; SameSite=Lax`;
        }
        const eventSource=  new EventSource(getEventSourcePath(), {withCredentials: true});

        eventSource.onopen = () => console.log('SSE connected');

        eventSource.addEventListener('vaccine-update', (event) => {
            setHasNotification(true);
            setLatestUpdate(event.data);
            setShowPopup(true);

            const audio = new Audio('/notification.mp3');
            audio.play();

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

    return (
        <Authentication>
            <div className={styles.notificationContainer}>
                {showPopup && (
                    <div className={styles.popupMessage}>
                        🔔 Ai primit o notificare
                    </div>
                )}
                {isOpen && (
                    <div className={styles.notificationDropdown}>
                        {latestUpdate}
                    </div>
                )}
                <button
                    className={`${styles.bellButton} ${hasNotification ? styles.hasNotification : ''}`}
                    onClick={handleBellClick}
                >
                    🔔
                    {hasNotification && <span className={styles.notificationDot}></span>}
                </button>
            </div>
        </Authentication>
    );
}
