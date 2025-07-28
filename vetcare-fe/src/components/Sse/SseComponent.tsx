'use client'
import { useEffect, useState } from 'react';
import styles from './Sse.module.css';
import {createEventSource} from "@/services/sseService";

export default function SseBell() {
    const [hasNotification, setHasNotification] = useState(false);
    const [latestUpdate, setLatestUpdate] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const eventSource = createEventSource();

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
    }, []);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        setHasNotification(false);
    };

    return (
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
    );
}
