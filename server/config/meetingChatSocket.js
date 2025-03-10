const Meeting = require("../models/meetingModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinMeeting", (meetingId) => {
      socket.join(meetingId);
      console.log(`User joined meeting room: ${meetingId}`);
    });

    socket.on("sendMessage", async ({ meetingId, sender, message }) => {
      const meeting = await Meeting.findById(meetingId);
      if (meeting) {
        meeting.chatMessages.push({ sender, message });
        await meeting.save();

        io.to(meetingId).emit("newMessage", { sender, message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
