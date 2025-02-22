const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema(
    {
      team_code: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String },
      date: { type: Date, default: Date.now },
      priority: {
        type: String,
        default: "normal",
        enum: ["high", "medium", "normal", "low"],
      },
      stage: {
        type: String,
        default: "todo",
        enum: ["todo", "in progress", "review", "done"],
      },
      label: {
        type: String,
        enum: ["research", "design", "content", "planning"],
      },
      activities: [
        {
          type: {
            type: String,
            default: "assigned",
            enum: [
              "assigned",
              "started",
              "in progress",
              "bug",
              "completed",
              "commented",
            ],
          },
          activity: String,
          date: { type: Date, default: Date.now },
          by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      assets: [String],
      team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      comments: [{
        text: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
      }],
      team_code: { type: String, required: true },
      isTrashed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
