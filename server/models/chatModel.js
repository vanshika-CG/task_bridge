const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: false },
    audio: { type: String, required: false }, // Stores audio file URL or base64
    status: { type: String, enum: ['sent', 'read'], default: 'sent' }, // Message status
    timestamp: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false } // Soft delete
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
