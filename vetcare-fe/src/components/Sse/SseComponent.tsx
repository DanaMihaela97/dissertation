'use client'
import { useEffect, useState } from 'react';

export default function SseComponent() {
    const [latestUpdate, setLatestUpdate] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8060/websocket/updates');

        eventSource.onopen = () => {
            console.log('SSE connection established.');
            setIsConnected(true);
        };

        eventSource.addEventListener('vaccine-update', (event) => {
            console.log('Received newly added vaccine:', event.data);
            setLatestUpdate(event.data);
        });

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
            setIsConnected(false);
        };

        // Cleanup function to close the connection when the component unmounts
        return () => {
            console.log('SSE connection closed.');
            eventSource.close();
        };
    }, []);

    return
}