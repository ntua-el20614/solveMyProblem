import React from 'react';
import StyledButton from '../components/Button'; // Adjust the path based on your project structure
import '../App.css';

function LandingPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <p>Welcome to our application! Click the button below to log in.</p>
            <StyledButton to="/login">Take me to login page</StyledButton>
            <StyledButton to="/register">Lets create an account</StyledButton>
            
        </div>
    );
}

export default LandingPage;
