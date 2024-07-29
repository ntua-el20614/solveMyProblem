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
        console.log('Registering with', usernameInput);
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
