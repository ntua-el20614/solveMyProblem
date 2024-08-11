import React from 'react';
import { Link } from 'react-router-dom';

const colors = {
    text: '#480B8B',
    background: '#E0E0E0'
};

export const StyledButton = ({ to, children, onClick, type = 'button' }) => {
    const outerBoxStyle = {
        display: 'inline-block',
        padding: '2px 2px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        border: '2px solid black',
        fontWeight: 'bold'
    };

    const buttonStyle = {
        backgroundColor: colors.background,
        border: 'none',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        fontWeight: 'bold',
        boxShadow: '0 5px #666',
        marginBottom: '5px',
        color: colors.text,
        textShadow: '0px -1px 0px rgba(255, 255, 255, 0.4)',
        transition: 'all 0.1s ease-in-out'
    };

    const handleMouseDown = (e) => {
        e.currentTarget.style.transform = 'translateY(4px)';
        e.currentTarget.style.boxShadow = '0 1px #666';
    };

    const handleMouseUp = (e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 5px #666';
    };

    // Using a common render function to apply the same styles whether it's a Link or a button
    const renderButton = (Component, props) => (
        <div style={outerBoxStyle}>
            <Component {...props} style={buttonStyle}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
                {children}
            </Component>
        </div>
    );

    return to ? renderButton(Link, { to }) : renderButton('button', { onClick, type });
};
