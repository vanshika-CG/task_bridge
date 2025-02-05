import React from 'react';
import { Link } from 'react-router-dom';
import '../style/MainHome.css';
import logo from '../assets/logo.png';
import profile from '../assets/home_/profile_i.png';

const MainHome = () => {
  const menuItems = [
    {
      id: 1,
      title: "Task Management",
      icon: "📊",
      path: "/tasks",
      className: "yellow"
    },
    {
      id: 2,
      title: "Video Conferencing",
      icon: "🎥",
      path: "/video",
      className: "orange"
    },
    {
      id: 3,
      title: "Document Sharing",
      icon: "📄",
      path: "/documents",
      className: "green"
    },
    {
      id: 4,
      title: "Virtual Whiteboard",
      icon: "🖊️",
      path: "/whiteboard",
      className: "blue"
    },
    {
      id: 5,
      title: "Messaging",
      icon: "💬",
      path: "/messages",
      className: "purple"
    },
    {
      id: 6,
      title: "Calendar",
      icon: "📅",
      path: "/calendar",
      className: "pink"
    }
  ];

  return (
    <div className="main-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Task Bridge" className="logo" />
        </div>

        <div className="nav-items">
          <div className="nav-link">
            <span>🏠</span>
            <span>Home</span>
          </div>

          <Link to="/team/:team_code" className="nav-link">
            <span>👥</span>
            <span>Team</span>
          </Link>
            
          <div className="profile-link">
            <img src={profile} alt="Profile" className="profile-image" />
            <span>Priy Mavani</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content-container">
        <div className="content-wrapper">
          {/* Left Side - Logo and Illustration */}
          <div className="logo-section">
            <div className="main-logo">
              <h1>
                Task<br/>Bridge
              </h1>
            </div>
            <div className="illustration-container">
              <img src="/illustration.png" alt="Background" />
            </div>
          </div>

          {/* Right Side - Menu Items */}
          <div className="menu-section">
            <div className="menu-items">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`menu-item ${item.className}`}
                >
                  <div className="menu-icon">
                    {item.icon}
                  </div>
                  <span className="menu-title">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHome; 