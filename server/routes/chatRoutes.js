const express = require('express');
const auth = require('../middleware/auth'); // Authentication Middleware
const { sendMessage, getChatHistory, markAsRead, deleteMessage } = require('../controllers/chatController');

const chatRouter = express.Router();

// **Chat Routes**
chatRouter.post('/send', auth, sendMessage);
chatRouter.get('/history/:userId', auth, getChatHistory);
chatRouter.put('/read', auth, markAsRead);
chatRouter.delete('/delete/:messageId', auth, deleteMessage);

module.exports = chatRouter;
