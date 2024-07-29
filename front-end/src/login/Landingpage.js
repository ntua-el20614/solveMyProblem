import React from 'react';
import StyledButton from '../components/Button'; // Adjust the path based on your project structure
import '../App.css';

function LandingPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '75px' }}>
            <p>Welcome to our application! Click the button below to log in.</p>
            <StyledButton to="/login" style={{ display: 'block', marginBottom: '50px' }}>
                Take me to login page
            </StyledButton>
            <br />
            <br />
            <StyledButton to="/register" style={{ display: 'block' }}>
                Let's create an account
            </StyledButton>
        </div>
    );
}

export default LandingPage;
