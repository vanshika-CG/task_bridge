import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../style/TeamMembers.css';
import profile from '../assets/home_/profile_i.png'; 

const TeamMembers = () => {
  const { team_code } = useParams();
  const [members, setMembers] = useState([]); // Ensure it's an array
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    email: '',
    role: '',
    password: '',
    team_code: `${team_code}`
  });
  const [error, setError] = useState('');

  // Fetch team members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
        if (Array.isArray(response.data)) {
          setMembers(response.data);
        } else {
          setMembers([]); // Ensure an array
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setMessage(error.response?.data?.message || 'Error fetching team members');
        setMembers([]); // Avoid undefined errors
      }
    };
    fetchMembers();
  }, [team_code]);

  // Open Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
  };

  // Handle Editing a User
  const handleEditUser = async (userData) => {
    if (!selectedUser) {
      setMessage("No user selected for editing.");
      return;
    }
    try {
      const response = await axios.patch(
        `https://task-bridge-eyh5.onrender.com/team/user/${selectedUser.full_name}/${team_code}/edit`,
        userData
      );
      
      // Fetch updated member list after successful edit
      const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
      setMembers(updatedMembersResponse.data);
      
      setMessage('User updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage(error.response?.data?.message || "Error updating user");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.full_name || !formData.email || !formData.role || !formData.password) {
        setError('Please fill in all required fields');
        return;
    }

    try {
        const userData = {
            team_code: team_code,
            full_name: formData.full_name.trim(),
            title: formData.title.trim(),
            email: formData.email.toLowerCase().trim(),
            role: formData.role.toLowerCase(),
            password: formData.password
        };

        console.log('Attempting to add user:', {
            ...userData,
            password: '[REDACTED]'
        });

        const response = await axios.post(
            'http://localhost:4400/team/new_user',
            userData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Server response:', response.data);

        // Fetch updated member list after successful addition
        const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
        setMembers(updatedMembersResponse.data);
            
        // Reset form and close modal
        setIsAddModalOpen(false);
        setFormData({
            full_name: '',
            title: '',
            email: '',
            role: '',
            password: '',
            team_code: team_code
        });
        setError('');
        setMessage('User added successfully!');
    } catch (err) {
        console.error('Error adding user:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        });

        if (err.response?.status === 409) {
            setError('A user with this email already exists.');
        } else if (err.response?.status === 400) {
            setError(err.response.data.message || 'Invalid input. Please check all fields.');
        } else if (err.response?.status === 403) {
            setError('You do not have permission to add users.');
        } else if (err.response?.status === 500) {
            setError('Server error. Please try again later.');
        } else {
            setError(err.response?.data?.message || 'Failed to add user. Please try again.');
        }
    }
  };

  // Add this useEffect to ensure team_code is always set
  useEffect(() => {
    if (team_code) {
      setFormData(prev => ({
        ...prev,
        team_code: team_code
      }));
    }
  }, [team_code]);

  // Add this new function to handle user deletion
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      try {
        await axios.delete(
          `https://task-bridge-eyh5.onrender.com/team/user/${user.full_name}/${team_code}/delete`
        );
        
        // Update the members list after successful deletion
        const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`);
        setMembers(updatedMembersResponse.data);
        
        setMessage('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Team Members</h2>
        <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)}>
          Add Member
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      
      <div className="table-container">
        <div className="table-header">
          <div>Full Name</div>
          <div>Title</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>

        {members.length > 0 ? (
          members.map((member) => (
            <div key={member?._id || Math.random()} className="table-row">
              <div className="user-info">
                <div className="avatar">
                  <img src={profile} alt="profile" />
                 
                </div>
                <span>{member?.full_name || "Unknown User"}</span>
              </div>
              <div>{member?.title || "-"}</div>
              <div>{member?.email || "-"}</div>
              <div>
                <span className="role-badge">
                  {member?.role || "Member"}
                </span>
              </div>
              <div className="action-buttons">
                <button 
                  onClick={() => openEditModal(member)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteUser(member)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-message">No team members found.</div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <EditUserForm user={selectedUser} onSubmit={handleEditUser} onCancel={closeEditModal} />
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Team Member</h3>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleAddUser} className="form-container">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                className="form-input"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const EditUserForm = ({ user, onSubmit, onCancel }) => {
  if (!user) {
    return <p>No user selected for editing.</p>;
  }

  const [formData, setFormData] = useState({
    full_name: user.full_name,
    title: user.title || '',
    email: user.email || '',
    role: user.role || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
        readOnly
        className="form-input"
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="form-input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        required
        className="form-input"
      />
      <div className="form-buttons">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="submit-btn"
        >
          Update User
        </button>
      </div>
    </form>
  );
};

export default TeamMembers;


