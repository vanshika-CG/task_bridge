const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const io = require('../config/socket'); // Import Socket.io instance

// **Send Message**
exports.sendMessage = async (req, res) => {
    try {
        const { receiver, message, audio } = req.body;
        const sender = req.user._id; // Extract sender from JWT token

        if (!receiver) {
            return res.status(400).json({ success: false, message: "Receiver ID is required" });
        }

        // Debugging logs
        console.log("Sender:", sender);
        console.log("Receiver:", receiver);
        console.log("Message:", message);
        console.log("Audio:", audio);

        const chat = new Chat({
            sender,
            receiver,
            message,
            audio
        });

        await chat.save();

        // Debugging logs
        console.log("Chat message saved:", chat);

        // Emit message via Socket.io
        if (io.getIO()) {
            io.getIO().to(receiver.toString()).emit("newMessage", chat);
        } else {
            console.log("Socket.io not initialized yet.");
        }

        res.status(201).json({ success: true, chat });
    } catch (error) {
        console.error("Error in sendMessage:", error);  // Log error details
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


// **Get Chat History Between Two Users**
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const sender = req.user._id;

        const chats = await Chat.find({
            $or: [
                { sender, receiver: userId },
                { sender: userId, receiver: sender }
            ],
            deleted: false
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// **Mark Messages as Read**
exports.markAsRead = async (req, res) => {
    try {
        const { sender } = req.body;
        const receiver = req.user._id;

        await Chat.updateMany(
            { sender, receiver, status: 'sent' },
            { status: 'read' }
        );

        io.getIO().to(sender.toString()).emit("messageRead", { sender, receiver });

        res.status(200).json({ success: true, message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// **Delete Message (Soft Delete)**
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Chat.findById(messageId);
        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        message.deleted = true;
        await message.save();

        io.getIO().to(message.receiver.toString()).emit("messageDeleted", { messageId });

        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};
