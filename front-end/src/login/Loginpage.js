import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../components/Button';
import '../App.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to store login error messages
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    console.log('Logging in with', username);
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:7001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.message === "Authentication successful") {
        navigate('/homepage'); // Navigate to homepage on successful login
      } else {
        setError(data.message || "Failed to login"); // Set error message based on response
      }
    } catch (error) {
      console.error('Failed to login:', error);
      setError('Network or server error');
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: '350px',
    backgroundColor: 'white',
    gap: '10px',
  };

  const inputStyle = {
    margin: '10px 20px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '90%',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    textAlign: 'left',
    width: '100%',
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '10px'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '75px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <label style={labelStyle}>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div style={buttonContainerStyle}>
          <StyledButton as="button" type="submit">Login</StyledButton>
          <StyledButton to="/">Cancel</StyledButton>
        </div>
      </form>
    </div>
  );
}
