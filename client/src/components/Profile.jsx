import React, { useEffect, useState } from 'react';
import { Home, MapPin, Mail, IdCard, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/Profile.css';
import profile from '../assets/home_/profile_i.png';
import ProfileLoader from '../Ui/Enter'; // Import the loader component

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming token is stored in sessionStorage
        const response = await fetch('https://task-bridge-eyh5.onrender.com/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProfile();
  }, []);

  // Show loader while fetching data
  if (loading) {
    return <ProfileLoader />;
  }

  return (
    <div className="profile-container">
      <div className="header">
        <Link className="home-button" to='/home'>
          <Home size={24} />
        </Link>
        <div className="title">Profile</div>
        <div>
          {/* Empty div for alignment */}
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-image-container">
          <img src={profile} alt="Profile" className="profile-image" />
        </div>
        
        <h2 className="profile-name">{user.full_name}</h2>
        <p className="profile-title">{user.title}</p>
        
        <div className="experience-badge">
          Role: {user.role}
        </div>
      </div>
      
      <div className="details-card">
        <div className="detail-section">
          <h3 className="section-title">Team Code</h3>
          <div className="detail-content">
            <div className="detail-item">
              <span>{user.team_code}</span>
            </div>
          </div>
        </div>
        
        <div className="detail-section">
          <h3 className="section-title">Title</h3>
          <div className="detail-content">
            <div className="detail-item">
              <IdCard size={20} />
              <span>{user.title}</span>
            </div>
          </div>
        </div>
        <div className="detail-section">
          <h3 className="section-title">Email</h3>
          <div className="detail-content">
            <div className="detail-item">
              <Mail size={20} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        
        <div className="detail-section">
          <h3 className="section-title">Role</h3>
          <div className="detail-content">
            <div className="detail-item">
              <Briefcase size={20} />
              <span>{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;