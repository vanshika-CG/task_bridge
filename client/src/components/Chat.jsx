// // Chat.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { format } from 'date-fns';
// import '../style/Chat.css';
// import { io } from 'socket.io-client';
// import { Link } from 'react-router-dom';

// const Chat = () => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioStream, setAudioStream] = useState(null);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteConfirmation, setDeleteConfirmation] = useState({
//     isOpen: false,
//     messageId: null
//   });
//   const [isTyping, setIsTyping] = useState(false);
//   const chatContainerRef = useRef(null);
//   const socket = useRef(null);

//   const team_code = JSON.parse(sessionStorage.getItem("team_code"));



// useEffect(() => {
//   let typingTimer;
//   if (selectedMember && newMessage) {
//     if (!isTyping) {
//       setIsTyping(true);
//       socket.current.emit('typing', {
//         sender: sessionStorage.getItem('userId'),
//         receiver: selectedMember._id
//       });
//     }
//     clearTimeout(typingTimer);
//     typingTimer = setTimeout(() => {
//       setIsTyping(false);
//       socket.current.emit('stopTyping', {
//         sender: sessionStorage.getItem('userId'),
//         receiver: selectedMember._id
//       });
//     }, 1000);
//   }
//   return () => clearTimeout(typingTimer);
// }, [newMessage, selectedMember]);

//   // useEffect(() => {
//   //   socket.current = io('https://task-bridge-eyh5.onrender.com');
    
//   //   socket.current.on('connect', () => {
//   //     socket.current.emit('join', sessionStorage.getItem('userId'));
//   //   });

//   //   socket.current.on('newMessage', handleNewMessage);
//   //   socket.current.on('messageDeleted', handleMessageDeleted);

//   //   fetchTeamMembers();

//   //   return () => {
//   //     socket.current.disconnect();
//   //   };
//   // }, []);

  
//   useEffect(() => {
//     socket.current = io('https://task-bridge-eyh5.onrender.com');
  
//     socket.current.on('connect', () => {
//       socket.current.emit('join', sessionStorage.getItem('userId'));
//       console.log('connected to socket.io')
//     });
  
//     // Cleanup previous listeners to avoid duplicates
//     socket.current.off('newMessage');
//     socket.current.off('messageDeleted');
  
//     // Handle receiving new messages in real-time
//     socket.current.on('newMessage', (message) => {
//       setMessages((prevMessages) => {
//         if (
//           selectedMember && 
//           (selectedMember._id === message.sender || selectedMember._id === message.receiver)
//         ) {
//           return [...prevMessages, message]; // Append new message in real-time
//         }
//         return prevMessages;
//       });
  
//       // Scroll chat to bottom automatically when a new message arrives
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//       }
//     });
  
//     // Handle message deletion in real-time
//     socket.current.on('messageDeleted', ({ messageId }) => {
//       setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
//     });
  
//     return () => {
//       socket.current.off('newMessage');
//       socket.current.off('messageDeleted');
//     };
//   }, [selectedMember]); // Depend on `selectedMember`
  

//   const fetchTeamMembers = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const response = await fetch(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('token')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch team members');
//       }

//       const data = await response.json();
//       const currentUserId = sessionStorage.getItem('userId');
//       const filteredMembers = data.filter(member => member._id !== currentUserId);
//       setTeamMembers(filteredMembers);
//     } catch (error) {
//       console.error('Error fetching team members:', error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeamMembers();
//   }, []); // Empty dependency array means it runs once on component mount
  
//   const fetchChatHistory = async (memberId) => {
//     try {
//       const response = await fetch(`https://task-bridge-eyh5.onrender.com/chat/history/${memberId}`, {
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setMessages(data.chats);
//       markMessagesAsRead(memberId);
//     } catch (error) {
//       console.error('Error fetching chat history:', error);
//     }
//   };

//   // const handleNewMessage = (message) => {
//   //   if (selectedMember?._id === message.sender || selectedMember?._id === message.receiver) {
//   //     setMessages(prev => [...prev, message]);
//   //     markMessagesAsRead(message.sender);
//   //   } else {
//   //     setUnreadCounts(prev => ({
//   //       ...prev,
//   //       [message.sender]: (prev[message.sender] || 0) + 1
//   //     }));
//   //   }
//   // };

//   const handleNewMessage = (message) => {
//     if (selectedMember && 
//         (selectedMember._id === message.sender || selectedMember._id === message.receiver)) {
//       setMessages(prev => [...prev, message]);
//       // Scroll to bottom when new message arrives
//       if (chatContainerRef.current) {
//         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//       }
//       // Mark message as read if we're in the chat
//       markMessagesAsRead(message.sender);
//     } else {
//       // Update unread count if we're not in the chat
//       setUnreadCounts(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1
//       }));
//     }
//   };

//   const handleMessageDeleted = ({ messageId }) => {
//     setMessages(prev => prev.filter(msg => msg._id !== messageId));
//   };

//   const markMessagesAsRead = async (senderId) => {
//     try {
//       await fetch('https://task-bridge-eyh5.onrender.com/chat/read', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ sender: senderId })
//       });
//       setUnreadCounts(prev => ({ ...prev, [senderId]: 0 }));
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//     }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setAudioStream(stream);
//       const recorder = new MediaRecorder(stream);
//       const chunks = [];

//       recorder.ondataavailable = (e) => chunks.push(e.data);
//       recorder.onstop = async () => {
//         const blob = new Blob(chunks, { type: 'audio/wav' });
//         const base64Audio = await convertBlobToBase64(blob);
//         sendMessage(null, base64Audio);
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Error starting recording:', error);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       audioStream.getTracks().forEach(track => track.stop());
//       setIsRecording(false);
//     }
//   };

//   const convertBlobToBase64 = (blob) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.readAsDataURL(blob);
//     });
//   };

//   // const sendMessage = async (text, audio = null) => {
//   //   try {
//   //     await fetch('https://task-bridge-eyh5.onrender.com/chat/send', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
//   //         'Content-Type': 'application/json'
//   //       },
//   //       body: JSON.stringify({
//   //         receiver: selectedMember._id,
//   //         message: text,
//   //         audio: audio
//   //       })
//   //     });
//   //     if (text) setNewMessage('');
//   //   } catch (error) {
//   //     console.error('Error sending message:', error);
//   //   }
//   // };


//   const sendMessage = async (text, audio = null) => {
//     try {
//       const response = await fetch('https://task-bridge-eyh5.onrender.com/chat/send', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           receiver: selectedMember._id,
//           message: text,
//           audio: audio
//         })
//       });
      
//       const data = await response.json();
//       if (data.success) {
//         // Update messages immediately after successful send
//         setMessages(prev => [...prev, data.chat]);
//         if (text) setNewMessage('');
        
//         // Scroll to bottom after sending
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//       }
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   const handleDeleteClick = (messageId) => {
//     setDeleteConfirmation({
//       isOpen: true,
//       messageId
//     });
//   };

//   const handleConfirmDelete = async () => {
//     try {
//       if (deleteConfirmation.messageId) {
//         await fetch(`https://task-bridge-eyh5.onrender.com/chat/delete/${deleteConfirmation.messageId}`, {
//           method: 'DELETE',
//           headers: {
//             'Authorization': `Bearer ${sessionStorage.getItem('token')}`
//           }
//         });
//         setDeleteConfirmation({
//           isOpen: false,
//           messageId: null
//         });
//       }
//     } catch (error) {
//       console.error('Error deleting message:', error);
//     }
//   };

//   const groupMessagesByDate = (messages) => {
//     const groups = {};
//     messages.forEach(message => {
//       const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
//       if (!groups[date]) groups[date] = [];
//       groups[date].push(message);
//     });
//     return groups;
//   };

//   const DeleteConfirmationPopup = () => {
//     if (!deleteConfirmation.isOpen) return null;

//     return (
//       <div className="delete-confirmation-overlay">
//         <div className="delete-confirmation-popup">
//           <h3>Delete Message</h3>
//           <p>Are you sure you want to delete this message?</p>
//           <div className="delete-confirmation-buttons">
//             <button 
//               className="cancel-button"
//               onClick={() => setDeleteConfirmation({ isOpen: false, messageId: null })}
//             >
//               Cancel
//             </button>
//             <button 
//               className="confirm-button"
//               onClick={handleConfirmDelete}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return <div className="loading-state">Loading team members...</div>;
//   }

//   if (error) {
//     return <div className="error-state">Error: {error}</div>;
//   }

//   return (
    
//     <div className="chat-container">
//        <Link className="home-btn1" to = '/home'>
//           Home
//         </Link>
//       <div className="team-members-list">
//         {teamMembers && teamMembers.length > 0 ? (
//           teamMembers.map(member => (
//             <div
//               key={member._id}
//               className={`member-item ${selectedMember?._id === member._id ? 'selected' : ''}`}
//               onClick={() => {
//                 setSelectedMember(member);
//                 fetchChatHistory(member._id);
//               }}
//             >
//               <div className="member-info">
//                 <span className="member-name">{member.full_name}</span>
//                 <span className="member-title">{member.title}</span>
//               </div>
//               {unreadCounts[member._id] > 0 && (
//                 <span className="unread-badge">{unreadCounts[member._id]}</span>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="no-members">No team members found</div>
//         )}
//       </div>

//       {selectedMember ? (
//         <div className="chat-window">
//           <div className="chat-header">
//             <div className="header-info">
//               <span className="header-name">{selectedMember.full_name}</span>
//               <span className="header-title">{selectedMember.title}</span>
//             </div>
//           </div>

//           <div className="messages-container" ref={chatContainerRef}>
//             {messages.length > 0 ? (
//               Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
//                 <div key={date}>
//                   <div className="date-separator">{format(new Date(date), 'MMMM d, yyyy')}</div>
//                   {dateMessages.map(message => (
//                     <div
//                       key={message._id}
//                       className={`message ${message.sender === sessionStorage.getItem('userId') ? 'sent' : 'received'}`}
//                     >
//                       {message.message && <div className="message-text">{message.message}</div>}
//                       {message.audio && (
//                         <audio controls className="audio-message">
//                           <source src={message.audio} type="audio/wav" />
//                         </audio>
//                       )}
//                       <div className="message-info">
//                         <span className="message-time">
//                           {format(new Date(message.timestamp), 'HH:mm')}
//                         </span>

                      
//                         {message.sender === sessionStorage.getItem('userId') && (
//                          <div className="message-actions" style={{color:'yellow'}}> delete
//                          <button onClick={() => handleDeleteClick(message._id)}>
//                            <i className="fas fa-trash"></i>
//                            delete
//                          </button>
//                        </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))
//             ) : (
//               <div className="no-messages">No messages yet</div>
//             )}
//           </div>

//           <div className="message-input">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a message..."
//               onKeyPress={(e) => e.key === 'Enter' && sendMessage(newMessage)}
//             />
//             <button
//               className={`record-button ${isRecording ? 'recording' : ''}`}
//               onClick={isRecording ? stopRecording : startRecording}
//             >
//               <i className={`fas fa-microphone${isRecording ? '-slash' : ''}`}></i>
//             </button>
//             <button
//               className="send-button"
//               onClick={() => sendMessage(newMessage)}
//               disabled={!newMessage.trim() && !isRecording}
//             >
//               <i className="fas fa-paper-plane"></i>
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="no-chat-selected">
//           Select a team member to start chatting
//         </div>
//       )}
//       <DeleteConfirmationPopup />
//     </div>
//   );
// };

// export default Chat;


import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import Loader from '../Ui/Enter'; // Import the loader component
import '../style/Chat.css';

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
  const [isFetchingChat, setIsFetchingChat] = useState(false); // For chat history loading
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    messageId: null
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const socket = useRef(null);

  const team_code = (sessionStorage.getItem('team_code'));
  const full_name = JSON.parse(sessionStorage.getItem('full_name'));
  console.log(full_name);

  // Connect to socket.io
  useEffect(() => {
    socket.current = io('https://task-bridge-eyh5.onrender.com');

    socket.current.on('connect', () => {
      socket.current.emit('join', sessionStorage.getItem('userId'));
      console.log('Connected to socket.io');
    });

    // Handle new messages
    socket.current.on('newMessage', (message) => {
      setMessages((prevMessages) => {
        if (
          selectedMember &&
          (selectedMember._id === message.sender || selectedMember._id === message.receiver)
        ) {
          return [...prevMessages, message];
        }
        return prevMessages;
      });

      // Scroll to bottom when a new message arrives
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    });

    // Handle message deletion
    socket.current.on('messageDeleted', ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedMember]);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }

        const data = await response.json();
        const currentUserId = sessionStorage.getItem('userId');
        const filteredMembers = data.filter((member) => member._id !== currentUserId);
        setTeamMembers(filteredMembers);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);



  
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

  // const sendMessage = async (text, audio = null) => {
  //   try {
  //     await fetch('https://task-bridge-eyh5.onrender.com/chat/send', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         receiver: selectedMember._id,
  //         message: text,
  //         audio: audio
  //       })
  //     });
  //     if (text) setNewMessage('');
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };


  const sendMessage = async (text, audio = null) => {
    try {
      const response = await fetch('https://task-bridge-eyh5.onrender.com/chat/send', {
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
      
      const data = await response.json();
      if (data.success) {
        // Update messages immediately after successful send
        setMessages(prev => [...prev, data.chat]);
        if (text) setNewMessage('');
        
        // Scroll to bottom after sending
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Fetch chat history for a selected member
  const fetchChatHistory = async (memberId) => {
    try {
      setIsFetchingChat(true);
      const response = await fetch(`https://task-bridge-eyh5.onrender.com/chat/history/${memberId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMessages(data.chats);
      markMessagesAsRead(memberId);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsFetchingChat(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (senderId) => {
    try {
      await fetch('https://task-bridge-eyh5.onrender.com/chat/read', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender: senderId })
      });
      setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // // Send a message
  // const sendMessage = async (text, audio = null) => {
  //   try {
  //     const response = await fetch('https://task-bridge-eyh5.onrender.com/chat/send', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         receiver: selectedMember._id,
  //         message: text,
  //         audio: audio
  //       })
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       setMessages((prev) => [...prev, data.chat]);
  //       if (text) setNewMessage('');
  //       if (chatContainerRef.current) {
  //         chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };

  // Delete a message
  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirmation.messageId) {
        await fetch(`https://task-bridge-eyh5.onrender.com/chat/delete/${deleteConfirmation.messageId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
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

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };

  // Delete confirmation popup
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
            <button className="confirm-button" onClick={handleConfirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <Link className="home-btn12" to="/home">
        Home
      </Link>

      {/* Team Members List */}
      <div className="team-members-list">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="error-state">Error: {error}</div>
        ) : teamMembers.length > 0 ? (
          teamMembers.map((member) => (
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

      {/* Chat Window */}
      {selectedMember ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <span className="header-name">{selectedMember.full_name}</span>
              <span className="header-title">{selectedMember.title}</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="messages-container" ref={chatContainerRef}>
            {isFetchingChat ? (
              <Loader />
            ) : messages.length > 0 ? (
              Object.entries(groupMessagesByDate(messages)).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="date-separator">{format(new Date(date), 'MMMM d, yyyy')}</div>
                  {dateMessages.map((message) => (
                    <div
                      key={message._id}
                      className={`message  ${
                        message.sender == sessionStorage.getItem('userId') ? 'sent-sender' : 'received-resiv'
                      }`}
                  
                    >
                      {message.message && <div className="message-text">{message.message}</div>}
                      {message.audio && (
                        <audio controls className="audio-message">
                          <source src={message.audio} type="audio/wav" />
                        </audio>
                      )}
                      <div className="message-info">
                        <span className="message-time">
                          {format(new Date(message.timestamp), 'HH:mm')}
                         
                        </span>
                        {message.sender === sessionStorage.getItem('userId') && (
                          <button
                            className="delete-button"
                            onClick={() =>
                              setDeleteConfirmation({ isOpen: true, messageId: message._id })
                            }
                          >
                            Delete
                          </button>
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

          {/* Message Input */}
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
        <div className="no-chat-selected">Select a team member to start chatting</div>
      )}

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup />
    </div>
  );
};

export default Chat;