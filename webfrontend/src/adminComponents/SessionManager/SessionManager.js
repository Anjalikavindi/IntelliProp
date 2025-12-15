// src/adminComponents/SessionManager/SessionManager.js

import React, { useEffect, useRef } from 'react';
import { checkInactivity, resetActivityTimer } from '../../utils/authUtils'; 

// Check activity every 5 minutes (less aggressive than per minute but frequent enough)
const CHECK_INTERVAL = 60 * 1000; 

const SessionManager = ({ children }) => {
    const intervalRef = useRef(null);

    // This handles any user interaction (mouse/keyboard/scroll/click)
    const handleActivity = () => {
        resetActivityTimer();
    };

    useEffect(() => {
        // 1. Set up periodic check
        // Check for inactivity every CHECK_INTERVAL
        intervalRef.current = setInterval(() => {
            checkInactivity();
        }, CHECK_INTERVAL);

        // 2. Set up event listeners to detect user activity and reset the timer immediately
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('scroll', handleActivity);
        window.addEventListener('click', handleActivity);

        // Cleanup function runs when the component unmounts (e.g., user logs out or leaves the admin section)
        return () => {
            clearInterval(intervalRef.current);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, []);

    return <>{children}</>;
};

export default SessionManager;