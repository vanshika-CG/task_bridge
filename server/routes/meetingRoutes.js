const express = require("express");
const meetingRouter = express.Router();
const { createMeeting, getUpcomingMeetings, getMeetingById, joinMeeting, addNote, getMeetingChat } = require("../controllers/meetingController");
const authMiddleware = require("../middleware/auth");

meetingRouter.post("/create", authMiddleware, createMeeting);
meetingRouter.get("/upcoming/:team_code", authMiddleware, getUpcomingMeetings);
meetingRouter.get("/:id", authMiddleware, getMeetingById);
meetingRouter.post("/:id/join", authMiddleware, joinMeeting);
meetingRouter.post("/:id/notes", authMiddleware, addNote);
meetingRouter.get("/:id/chat", authMiddleware, getMeetingChat);

module.exports = meetingRouter;
