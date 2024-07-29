import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../logo_.jpg'; // Adjust the path based on your project structure

const colors = {
    primary: '#4a90e2',
    secondary: '#d3d3d3',
    letters: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.4)'
};

function Header({ username = '' }) {
    const isLoggedIn = !!Cookies.get('user');

    return (
        <header style={{ 
            backgroundColor: colors.primary, 
            padding: '20px 40px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'fixed', 
            top: '0', 
            width: '100%',
            zIndex: '1000',
            boxShadow: `0 4px 8px ${colors.shadow}`
        }}>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                <Link to={isLoggedIn ? "/homepage" : "/"}>
                    <img src={logo} alt="Logo" style={{ height: '60px', maxWidth: '200px', objectFit: 'contain' }} />
                </Link>
            </div>
            <div style={{ 
                position: 'absolute', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                textAlign: 'center' 
            }}>
                <h1 style={{ 
                    margin: '0', 
                    color: colors.letters,
                    fontSize: '2.5rem', 
                    fontFamily: '"Roboto", sans-serif' 
                }}>
                    SolveMyProblem
                </h1>
                <p style={{ 
                    margin: '5px 0 0', 
                    color: colors.secondary, 
                    fontSize: '1rem', 
                    fontFamily: '"Roboto", sans-serif' 
                }}>
                    A platform to solve your complex problems using cloud computing.
                </p>
            </div>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                <p style={{ 
                    margin: '0 50px', 
                    color: colors.letters, 
                    fontSize: '1.2rem', 
                    fontFamily: '"Roboto", sans-serif' 
                }}>
                    {username ? `Hello ${username}!` : ''}
                </p>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer style={{ 
            backgroundColor: colors.primary, 
            padding: '20px 40px', 
            textAlign: 'center', 
            position: 'fixed', 
            bottom: '0', 
            width: '100%',
            boxShadow: `0 -4px 8px ${colors.shadow}`
        }}>
            <p style={{ 
                margin: '0', 
                color: colors.letters, 
                fontSize: '1rem', 
                fontFamily: '"Roboto", sans-serif' 
            }}>
                © 2024 SolveMyProblem. All rights reserved.
            </p>
        </footer>
    );
}

export { Header, Footer };
