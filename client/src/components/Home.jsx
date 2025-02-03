import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Home.css';


import home_i from '../assets/home_i.png'
import logo from '../assets/Logo.png'
const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div className="Home">
            <div className="part1">
                <div className="logo">
                    <img src={logo} alt="Task Bridge Logo" />
                </div>
                <h1>Welcome to Task Bridge</h1>
                <h2>A Platform for task management and team<br />to work together</h2>
                
                <div className="button-group">
                    <button className="join-team" onClick={() => navigate('/login')}>
                        <span className="icon">👥</span> Join Your Team
                    </button>
                    <button className="create-team" onClick={() => navigate('/signup')}>
                        <span className="icon">⊕</span> Create Team
                    </button>
                </div>

                <p className="description">
                    Task Bridge Is An Innovative Platform Designed To Streamline Task Management And Facilitate 
                    Seamless Team Collaboration. It Provides Individuals And Teams With A Comprehensive Set Of Tools To 
                    Manage Projects, Organize Tasks, And Communicate Effectively, All In One Place
                </p>
            </div>
            <div className="part2">
                <img src={home_i} alt="Team Collaboration" />
            </div>
        </div>
    );
};

export default Home;