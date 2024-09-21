import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const PageName = ({ name }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
    const [statusColor, setStatusColor] = useState('#00FF00'); // Default to red

    useEffect(() => {
        const fetchHealth = async () => {
            const urls = [
                'http://localhost:4000/health',
                'http://localhost:4001/health',
                'http://localhost:4002/health'
            ];

            try {
                const results = await Promise.all(urls.map(url =>
                    Promise.race([
                        fetch(url).then(response => response.json()).catch(() => ({ message: 'offline' })), // Handle fetch errors
                        new Promise(resolve => setTimeout(() => resolve({ message: 'offline' }), 1000)) // 1 second timeout
                    ])
                ));

                const allHealthy = results.every(r => r.message.includes('healthy'));
                const allOffline = results.every(r => r.message === 'offline');

                if (allHealthy) {
                    setStatusColor('#00FF00'); // Green
                } else if (allOffline) {
                    setStatusColor('#FF0000'); // Red
                } else {
                    setStatusColor('#FFA500'); // Orange
                }
            } catch (error) {
                setStatusColor('#FFA500'); // Set to orange if an error occurs
            }
        };

        const healthCheckInterval = setInterval(fetchHealth, 1000); // Checking health every second
        const timeInterval = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-GB'));
        }, 1000); // Updating time every second

        return () => {
            clearInterval(healthCheckInterval);
            clearInterval(timeInterval);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user_SMP');
        window.location.href = '/';
    };

    return (
        <div style={{
            display: 'flex',
            width: '90%',
            margin: '5% 5%',
            padding: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                width: '35%',
                textAlign: 'left',
                verticalAlign: 'top',
                fontSize: '24px',
                fontWeight: 'bold',
            }}>
                {name}
            </div>
            <div style={{
                width: '40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div>
                    Time: {time}
                    <div style={{
                        display: 'inline-block',
                        marginLeft: '10px',
                        height: '10px',
                        width: '10px',
                        borderRadius: '50%',
                        border: '1.5px solid black',
                        backgroundColor: statusColor
                    }} />
                </div>
                <button onClick={handleLogout} style={{
                    fontSize: '12px',
                    padding: '5px 8px',
                    cursor: 'pointer'
                }}>
                    Log out 🔒
                </button>
            </div>
        </div>
    );
};
