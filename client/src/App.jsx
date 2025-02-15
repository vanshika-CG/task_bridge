
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import TeamMembers from './components/TeamMembers';
import MainHome from './components/MainHome';
import Document from './components/Document';


import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for MainHome (new dashboard) */}
          <Route path="/home" element={<MainHome />} />

          {/* Route for Signup */}
          <Route path="/signup" element={<Signup />} />

          {/* Route for Login */}
          <Route path="/login" element={<Login />} />

          {/* Route for Team Members */}
          <Route path="/team" element={<TeamMembers />} />

          {/* Route for Document Sharing */}
          <Route path="/documents" element={<Document />} />

          {/* Default Route (Landing Page) */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;