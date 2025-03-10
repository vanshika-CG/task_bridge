import React from 'react';
import { Link } from 'react-router-dom';
import Pattern from '../Ui/Pattern'; 
import '../style/MainHome.css';
import logo from '../assets/Logo.png';
import profile from '../assets/home_/profile_i.png';

const MainHome = () => {
  const name = sessionStorage.getItem("full_name");
  console.log(name);

  const menuItems = [
    {
      id: 1,
      title: "Task Management",
      icon: "📊",
      path: "/task",
      className: "yellow"
    },
    {
      id: 2,
      title: "Video Conferencing",
      icon: "🎥",
      path: "/meeting",
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
      path: "/chat",
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
      {/* Add the Pattern component as the background */}
      <Pattern />

      {/* Navbar */}
      <nav className="navbar">
        
        <div className="logo-container">
          <img src={logo} alt="Task Bridge" className="logo11" />
        </div>

        <div className="nav-items">
          <div className="nav-link">
            <span>🏠</span>
            <span>Home</span>
          </div>

          <Link to="/contact" className="nav-link">
            <span></span>
            <span>Contact Us</span>
          </Link>

          <Link to="/about" className="nav-link">
            <span></span>
            <span>About Us</span>
          </Link>
          
          <Link to="/faq" className="nav-link">
            <span></span>
            <span>FAQ</span>
          </Link>
            
          <Link to="/team" className="nav-link">
            <span>👥</span>
            <span>Team</span>
          </Link>

          <Link to="/profile" className="profile-link">
            <img src={profile} alt="Profile" className="profile-image1" />
            <span>{name}</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content-container">
        <div className="content-wrapper">
          {/* Left Side - Logo and Illustration */}
          <div className="logo-section">
            <div className="main-logo">
              <h1 className="animated-title">
                Task<br/>Bridge
              </h1>
            </div>
            {/* <div className="illustration-container">
              <img src="/illustration.png" alt="Background" />
            </div> */}
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
