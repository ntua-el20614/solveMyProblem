import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { StyledButton } from '../components/Button';
import '../App.css';
import './styles/form.css';

export default function LoginPage({ setUsername }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cookies on component mount if needed
    Cookies.remove('token');
    setUsername('');  
    Cookies.remove('user_SMP');
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    if(!usernameInput || !password) {
      setError('Please fill in all fields');
      return;
    }
    console.log('Logging in with', usernameInput);
    try {
      const response = await fetch('http://localhost:4001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameInput, password })
      });
      const data = await response.json();
      console.log('Login response:', data);
      if (response.ok && data.message === "Authentication successful") {
        // Save token and username to cookies
        Cookies.set('token', data.token);
        Cookies.set('user_SMP', usernameInput);
        setUsername(usernameInput); // Update the username state in App component
        navigate('/homepage');
      } else {
        setError(data.message || "Failed to login");
      }
    } catch (error) {
      console.error('Failed to login:', error);
      setError('Network or server error');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '75px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="formStyle">
        <label className="labelStyle">
          Username:
          <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="inputStyle" />
        </label>
        <label className="labelStyle">
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="inputStyle" />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <div className="buttonContainerStyle">
          <StyledButton as="button" type="submit">Login</StyledButton>
          <StyledButton to="/">Cancel</StyledButton>
        </div>
      </form>
    </div>
  );
}
