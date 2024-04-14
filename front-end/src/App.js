import React from 'react';
import { BrowserRouter as Router, Routes, Route, ink } from 'react-router-dom';

import Landingpage from './login/Landingpage';
import Loginpage from './login/Loginpage';
import Homepage from './homepage/Homepage';
import Newsubmission from './submissions/Newsubmission';
import Editsubmission from './submissions/Editsubmission';
import Viewresults from './submissions/Viewresults';
import Credits from './credits/Credits';

function App() {
  return (
      <Router>
          <div> 
              <Routes>
                  <Route path="" element={<Landingpage />} />
                  <Route path="/login" element={<Loginpage />} />
                  <Route path="/homepage" element={<Homepage />} />
                  <Route path="/new_submission" element={<Newsubmission />} />
                  <Route path="/edit_submission" element={<Editsubmission />} />
                  <Route path="/view_results" element={<Viewresults />} />
                  <Route path="/my_credits" element={<Credits />} />
                
              </Routes>
          </div>
      </Router>
  );
}

export default App;