
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import TeamMembers from './components/TeamMembers';
import MainHome from './components/MainHome';
import Document from './components/Document';

import Meeting from "./components/Meeting";

import './App.css';
import Task from './components/Task';
import Chat from './components/Chat';
import Profile from './components/Profile';
import About from './components/About';
import Contact from './components/Contact';
import Faq from './components/Faq';
import Whiteboard from './components/Whiteboard';

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

          {/* Route for Chat Messanger */}
          <Route path="/chat" element={<Chat />} />

          {/* Route for Document Sharing */}
          <Route path="/documents" element={<Document />} />
          
          {/* Route for Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Route for About */}
          <Route path="/about" element={<About/>} />

          {/* Route for Contact */}
          <Route path="/contact" element={<Contact/>} />

          {/* Route for FAQ section */}
          <Route path="/faq" element={<Faq/>} />

          {/* Route for task Managment */}
          <Route path="/task" element={<Task />} />


          <Route path="/whiteboard" element={<Whiteboard />} />

          {/* Default Route (Landing Page) */}
          <Route path="/" element={<Home />} />
          <Route path="/meeting" element={<Meeting />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;