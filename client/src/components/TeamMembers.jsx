import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../style/TeamMembers.css';

const TeamMembers = () => {
  const [members, setMembers] = useState([]); // Ensure it's an array
  const [message, setMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { team_code } = useParams();

  // Fetch team members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`https://task-bridge-eyh5.onrender.com//team/${team_code}`);
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
        `http://localhost:4400/team/user/${selectedUser.full_name}/${team_code}/edit`,
        userData
      );
      setMessage(response.data.message);
      setMembers(members.map((member) =>
        member._id === selectedUser._id ? response.data.user : member
      ));
      closeEditModal();
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage(error.response?.data?.message || "Error updating user");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Team Members</h2>
        <button className="add-user-btn">+ Add New User</button>
      </div>

      {message && <p className="message">{message}</p>}
      
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
                  {/* Add user avatar here if available */}
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
                <button className="delete-btn">
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


