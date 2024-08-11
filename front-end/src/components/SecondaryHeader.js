import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const PageName = ({ name }) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const response = await fetch('http://localhost:4001/health');
                const data = await response.json();
                setStatus(data.message === "Login microservice is healthy");
            } catch (error) {
                setStatus(false);
            }
        };

        fetchHealth();
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-GB'));
        }, 1000);

        const healthCheckInterval = setInterval(fetchHealth, 30000);

        return () => {
            clearInterval(timer);
            clearInterval(healthCheckInterval);
        };
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
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
                        backgroundColor: status ? '#00FF00' : '#FF0000'
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
