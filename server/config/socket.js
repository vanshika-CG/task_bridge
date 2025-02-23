const socketIO = require('socket.io');

let io;

module.exports = {
    init: (server) => {
        io = require("socket.io")(server, {
            cors: { origin: "*" }
        });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("join", (userId) => {
                socket.join(userId);
                io.emit("userOnline", userId);
            });

            socket.on("typing", ({ sender, receiver }) => {
                io.to(receiver).emit("userTyping", { sender });
            });

            socket.on("stopTyping", ({ sender, receiver }) => {
                io.to(receiver).emit("userStoppedTyping", { sender });
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });

        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};
