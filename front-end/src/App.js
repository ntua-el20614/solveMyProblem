import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landingpage from './login/Landingpage';
import Loginpage from './login/Loginpage';
import Homepage from './homepage/Homepage';
import Newsubmission from './submissions/Newsubmission';
import Editsubmission from './submissions/Editsubmission';
import Viewresults from './submissions/Viewresults';
import Credits from './credits/Credits';

function Header() {
    return (
        <header style={{ backgroundColor: 'lightblue', padding: '10px 20px', textAlign: 'center' }}>
            <img src="path_to_logo_here" alt="SolveMyProblem Logo" style={{ height: '50px' }} />
            <h1>SolveMyProblem</h1>
            <p>A platform to solve your complex problems using cloud computing.</p>
        </header>
    );
}

function Footer() {
    return (
        <footer style={{ backgroundColor: 'lightblue', padding: '10px 20px', textAlign: 'center' }}>
            <p>© 2024 SolveMyProblem. All rights reserved.</p>
        </footer>
    );
}

function App() {
  return (
      <Router>
          <div>
              <Header />
              <Routes>
                  <Route path="/" element={<Landingpage />} />
                  <Route path="/login" element={<Loginpage />} />
                  <Route path="/homepage" element={<Homepage />} />
                  <Route path="/new_submission" element={<Newsubmission />} />
                  <Route path="/edit_submission" element={<Editsubmission />} />
                  <Route path="/view_results" element={<Viewresults />} />
                  <Route path="/my_credits" element={<Credits />} />
              </Routes>
              <Footer />
          </div>
      </Router>
  );
}

export default App;
