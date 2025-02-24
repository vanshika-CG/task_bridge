// Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import '../style/Chat.css';
import { io } from 'socket.io-client';

const Chat = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    messageId: null
  });
  const chatContainerRef = useRef(null);
  const socket = useRef(null);

  const team_code = JSON.parse(sessionStorage.getItem("team_code"));

  useEffect(() => {
    socket.current = io('http://localhost:4400');
    
    socket.current.on('connect', () => {
      socket.current.emit('join', sessionStorage.getItem('userId'));
    });

    socket.current.on('newMessage', handleNewMessage);
    socket.current.on('messageDeleted', handleMessageDeleted);

    fetchTeamMembers();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:4400/team/${team_code}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }

      const data = await response.json();
      const currentUserId = sessionStorage.getItem('userId');
      const filteredMembers = data.filter(member => member._id !== currentUserId);
      setTeamMembers(filteredMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:4400/chat/history/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data.chats);
      markMessagesAsRead(memberId);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleNewMessage = (message) => {
    if (selectedMember?._id === message.sender || selectedMember?._id === message.receiver) {
      setMessages(prev => [...prev, message]);
      markMessagesAsRead(message.sender);
    } else {
      setUnreadCounts(prev => ({
        ...prev,
        [message.sender]: (prev[message.sender] || 0) + 1
      }));
    }
  };

  const handleMessageDeleted = ({ messageId }) => {
    setMessages(prev => prev.filter(msg => msg._id !== messageId));
  };

  const markMessagesAsRead = async (senderId) => {
    try {
      await fetch('http://localhost:4400/chat/read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender: senderId })
      });
      setUnreadCounts(prev => ({ ...prev, [senderId]: 0 }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const base64Audio = await convertBlobToBase64(blob);
        sendMessage(null, base64Audio);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const sendMessage = async (text, audio = null) => {
    try {
      await fetch('http://localhost:4400/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver: selectedMember._id,
          message: text,
          audio: audio
        })
      });
      if (text) setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteClick = (messageId) => {
    setDeleteConfirmation({
      isOpen: true,
      messageId
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirmation.messageId) {
        await fetch(`http://localhost:4400/chat/delete/${deleteConfirmation.messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        setDeleteConfirmation({
          isOpen: false,
          messageId: null
        });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  const DeleteConfirmationPopup = () => {
    if (!deleteConfirmation.isOpen) return null;

    return (
      <div className="delete-confirmation-overlay">
        <div className="delete-confirmation-popup">
          <h3>Delete Message</h3>
          <p>Are you sure you want to delete this message?</p>
          <div className="delete-confirmation-buttons">
            <button 
              className="cancel-button"
              onClick={() => setDeleteConfirmation({ isOpen: false, messageId: null })}
            >
              Cancel
            </button>
            <button 
              className="confirm-button"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading-state">Loading team members...</div>;
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div className="chat-container">
      <div className="team-members-list">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map(member => (
            <div
              key={member._id}
              className={`member-item ${selectedMember?._id === member._id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedMember(member);
                fetchChatHistory(member._id);
              }}
            >
              <div className="member-info">
                <span className="member-name">{member.full_name}</span>
                <span className="member-title">{member.title}</span>
              </div>
              {unreadCounts[member._id] > 0 && (
                <span className="unread-badge">{unreadCounts[member._id]}</span>
              )}
            </div>
          ))
        ) : (
          <div className="no-members">No team members found</div>
        )}
      </div>

      {selectedMember ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <span className="header-name">{selectedMember.full_name}</span>
              <span className="header-title">{selectedMember.title}</span>
            </div>
          </div>

          <div className="messages-container" ref={chatContainerRef}>
            {messages.length > 0 ? (
              Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="date-separator">{format(new Date(date), 'MMMM d, yyyy')}</div>
                  {dateMessages.map(message => (
                    <div
                      key={message._id}
                      className={`message ${message.sender === sessionStorage.getItem('userId') ? 'sent' : 'received'}`}
                    >
                      {message.message && <div className="message-text">{message.message}</div>}
                      {message.audio && (
                        <audio controls className="audio-message">
                          <source src={message.audio} type="audio/wav" />
                        </audio>
                      )}
                      <div className="message-info">
                        <span className="message-time">time
                          {format(new Date(message.timestamp), 'HH:mm')}
                        </span>

                      {console.log(message.sender)}
                        {message.sender === sessionStorage.getItem('userId') && (
                         <div className="message-actions" style={{color:'yellow'}}> delete
                         <button onClick={() => handleDeleteClick(message._id)}>
                           <i className="fas fa-trash"></i>
                           delete
                         </button>
                       </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="no-messages">No messages yet</div>
            )}
          </div>

          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
            />
            <button
              className={`record-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <i className={`fas fa-microphone${isRecording ? '-slash' : ''}`}></i>
            </button>
            <button
              className="send-button"
              onClick={() => sendMessage(newMessage)}
              disabled={!newMessage.trim() && !isRecording}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="no-chat-selected">
          Select a team member to start chatting
        </div>
      )}
      <DeleteConfirmationPopup />
    </div>
  );
};

export default Chat;