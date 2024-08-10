import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import StyledButton from '../components/Button';
import '../App.css';
import './styles/form.css';

export default function RegisterPage({ setUsername }) {

  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cookies on component mount if needed
    Cookies.remove('token');
    setUsername('');
    Cookies.remove('user');
  }, []);

  const handleRegister = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!usernameInput || !password) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Registering with', usernameInput);

    try {
      const response = await fetch('http://localhost:4001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameInput, password })
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        // Registration successful
        Cookies.set('user', usernameInput); // Store username in a cookie
        setUsername(usernameInput); // Update the username state in App component
        navigate('/homepage'); // Navigate to homepage
      } else {
        // Handle errors such as user already exists
        setError(data.message || 'Failed to register');
      }
    } catch (error) {
      console.error('Failed to register:', error);
      setError('Network or server error');
    }
  };



  return (
    <div style={{ textAlign: 'center', marginTop: '75px' }}>
      <h2>Register</h2>
      <h3>Enter your desired username and password</h3>
      <form onSubmit={handleRegister} className="formStyle">
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
          <StyledButton as="button" type="submit">Register</StyledButton>
          <StyledButton to="/">Cancel</StyledButton>
        </div>
      </form>
    </div>
  );

} 
