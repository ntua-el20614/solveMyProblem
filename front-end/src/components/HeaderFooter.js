import React from 'react';

const colors = {
    primary: '#4a90e2', // a more muted blue
    secondary: '#d3d3d3', // light gray for secondary text
    letters: '#ffffff', // white text
    shadow: 'rgba(0, 0, 0, 0.1)' // subtle shadow
};

function Header({ username = '' }) {
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
            zIndex: '1000', // Ensures the header stays on top of other elements
            boxShadow: `0 4px 8px ${colors.shadow}`
        }}>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
                <img src="path_to_logo_here" alt="" style={{ height: '60px' }} />
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
                    margin: '0', 
                    color: colors.letters, 
                    fontSize: '1.2rem', 
                    fontFamily: '"Roboto", sans-serif' 
                }}>
                    {username ? `Hello, ${username}` : ''}
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
