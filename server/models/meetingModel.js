const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    team_code: { type: String, required: true },
    title: { type: String, required: true },
    agenda: { type: String },
    scheduledDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String },
        lastUpdated: { type: Date, default: Date.now },
      },
    ],
    chatMessages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed"],
      default: "scheduled",
    },
    meetingLink: { type: String },
    recordingLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
