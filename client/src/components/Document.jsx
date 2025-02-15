import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Document.css';
import { useNavigate } from 'react-router-dom';

const Document = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFolderFiles, setSelectedFolderFiles] = useState(null);
  const navigate = useNavigate();

  const team_code = sessionStorage.getItem('team_code'); // Get from auth context
  console.log(team_code);
  // const team_code = "team@123"
  const token = sessionStorage.getItem('token'); // Get from auth context
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzljNTQ3ZDdlZGU3MWZhYTlkY2UyYjgiLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6InByaXltYXZhbmlAZ21haWwuY29tIiwiaWF0IjoxNzM4Nzg3MDkwLCJleHAiOjE3MzkyMTkwOTB9.rEc1Jmf5UqD9oupzPI79lDONdpETSkDao8cG-_Cmf0A"
  console.log(token);
  
  // API Configuration
  const api = axios.create({
    baseURL: 'https://task-bridge-eyh5.onrender.com/file',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Fetch folders and documents
  useEffect(() => {
    fetchFolders();
    fetchDocuments();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await api.get(`/folder/${team_code}`);
      setFolders(response.data);
    } catch (err) {
      setError('Error fetching folders');
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/team/${team_code}`);
      setFiles(response.data);
    } catch (err) {
      setError('Error fetching documents');
      console.error(err);
    }
  };

  // Create new folder
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/folder', {
        name: newFolderName,
        team_code,
        parent_folder: currentFolder
      });
      setFolders([...folders, response.data]);
      setShowNewFolderModal(false);
      setNewFolderName('');
    } catch (err) {
      setError('Error creating folder');
      console.error(err);
    }
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('team_code', team_code);
    if (currentFolder) {
      formData.append('folder_id', currentFolder);
    }

    setLoading(true);
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFiles([...files, response.data]);
      setLoading(false);
    } catch (err) {
      setError('Error uploading file');
      setLoading(false);
      console.error(err);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      setFiles(files.filter(file => file._id !== id));
    } catch (err) {
      setError('Error deleting document');
      console.error(err);
    }
  };

  // Share document
  const handleShare = async (id, userId) => {
    try {
      const response = await api.post(`/${id}/share`, { user_id: userId });
      const updatedFiles = files.map(file => 
        file._id === id ? response.data : file
      );
      setFiles(updatedFiles);
    } catch (err) {
      setError('Error sharing document');
      console.error(err);
    }
  };

  return (
    <div className="document-container">
      {/* Header Section */}
      <div className="document-header">
        <button className="home-btn" onClick={() => navigate('/home')}>
          Home
        </button>
        <h1>Document Management</h1>
        <div className="header-actions">
          <button onClick={() => setShowNewFolderModal(true)}>
            Create Folder
          </button>
          <label className="upload-button">
            Upload File
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading Indicator */}
      {loading && <div className="loading">Uploading...</div>}

      {/* Folder Structure */}
      <div className="folder-structure">
        <h2>Folders</h2>
        <div className="folders-grid">
          {folders.map(folder => (
            <div 
              key={folder._id} 
              className="folder-card"
              onClick={() => setCurrentFolder(folder._id)}
            >
              <div className="folder-icon">📁</div>
              <div className="folder-info">
                <h3>{folder.name}</h3>
                <p>Created by: {folder.created_by.full_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="files-section">
        <h2>Files</h2>
        <table className="files-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Uploaded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file._id}>
                <td>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                  </a>
                </td>
                <td>{(file.size / 1024).toFixed(2)} KB</td>
                <td>{file.uploaded_by.full_name}</td>
                <td>
                  <div className="file-actions">
                    <button onClick={() => handleDelete(file._id)}>
                      Delete
                    </button>
                    <button onClick={() => handleShare(file._id, 'user_id')}>
                      Share
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder Name"
                required
              />
              <div className="modal-actions">
                <button type="submit">Create</button>
                <button 
                  type="button" 
                  onClick={() => setShowNewFolderModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Document; 