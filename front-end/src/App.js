import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';

import LandingPage from './login/Landingpage'; // Corrected component name based on your file
import LoginPage from './login/Loginpage';
import RegisterPage from './login/Registerpage';
import Homepage from './homepage/Homepage';
import NewSubmission from './submissions/Newsubmission';
import EditSubmission from './submissions/Editsubmission';
import ViewResults from './submissions/Viewresults';
import Credits from './credits/Credits';
import { Header, Footer } from './components/HeaderFooter';

function App() {

  const [username, setUsername] = useState(Cookies.get('user_SMP') || '');

  useEffect(() => {
    // Check for cookie changes every second
    const interval = setInterval(() => {
      const cookieUsername = Cookies.get('user_SMP');
      if (cookieUsername && cookieUsername !== username) {
        setUsername(cookieUsername);
      }
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [username]);



  return (
    <Router>
      <div className="app-container"> {/* Ensure the container uses flex */}
        <Header username={username} className="header" />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage setUsername={setUsername} />} />
            <Route path="/register" element={<RegisterPage setUsername={setUsername}/>} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/new_submission" element={<NewSubmission />} />
            <Route path="/edit_submission/:id" element={<EditSubmission />} />
            <Route path="/view_results/:id" element={<ViewResults />} />
            <Route path="/my_credits" element={<Credits />} />
          </Routes>
        </div>
        <Footer className="footer" />
      </div>
    </Router>
  );
}

export default App;
