import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import LandingPage from './login/Landingpage'; // Corrected component name based on your file
import LoginPage from './login/Loginpage';
import Homepage from './homepage/Homepage';
import NewSubmission from './submissions/Newsubmission';
import EditSubmission from './submissions/Editsubmission';
import ViewResults from './submissions/Viewresults';
import Credits from './credits/Credits';
import { Header, Footer } from './components/HeaderFooter';

function App() {
    return (
      <Router>
        <div className="app-container"> {/* Ensure the container uses flex */}
          <Header className="header" />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/new_submission" element={<NewSubmission />} />
              <Route path="/edit_submission" element={<EditSubmission />} />
              <Route path="/view_results" element={<ViewResults />} />
              <Route path="/my_credits" element={<Credits />} />
            </Routes>
          </div>
          <Footer className="footer" />
        </div>
      </Router>
    );
}

export default App;