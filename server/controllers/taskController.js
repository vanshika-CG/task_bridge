const Task = require('../models/taskModel');

const taskController = {
  // Get all tasks for a team
  getAllTasks: async (req, res) => {
    try {
      const { team_code } = req.params;
      if (!team_code) {
        return res.status(400).json({ message: 'Team code is required' });
      }

      const tasks = await Task.find({ 
        team_code,
        isTrashed: false 
      })
      .populate('team', 'full_name title')
      .sort({ createdAt: -1 });
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get tasks by stage for a team
  getTasksByStage: async (req, res) => {
    try {
      const { stage, team_code } = req.params;
      if (!team_code || !stage) {
        return res.status(400).json({ message: 'Team code and stage are required' });
      }

      const tasks = await Task.find({ 
        stage,
        team_code,
        isTrashed: false 
      })
      .populate('team', 'full_name title')
      .sort({ createdAt: -1 });
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new task (admin only)
  createTask: async (req, res) => {
    try {
      const { title, description, priority, label, team, date, team_code } = req.body;

      // Validate required fields
      if (!title || !team_code) {
        return res.status(400).json({ message: 'Title and team code are required' });
      }

      // Verify admin belongs to the same team
      if (req.user.team_code !== team_code) {
        return res.status(403).json({ message: 'You can only create tasks for your own team' });
      }

      const newTask = new Task({
        title,
        description,
        priority,
        label,
        team,
        date,
        team_code,
        activities: [{
          type: 'assigned',
          activity: 'Task created',
          by: req.user._id
        }]
      });

      const savedTask = await newTask.save();
      await savedTask.populate('team', 'full_name title');
      
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ 
        message: error.message,
        details: error.errors // Include validation errors if any
      });
    }
  },

  // Update task (admin only)
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const adminTeamCode = req.user.team_code;

      // Find the task first to verify team_code
      const existingTask = await Task.findById(id);
      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Verify admin belongs to the same team as the task
      if (existingTask.team_code !== adminTeamCode) {
        return res.status(403).json({ message: 'You can only update tasks from your own team' });
      }

      // Add activity log if stage is changed
      if (updates.stage) {
        updates.$push = {
          activities: {
            type: 'in progress',
            activity: `Task moved to ${updates.stage}`,
            by: req.user._id
          }
        };
      }

      const task = await Task.findOneAndUpdate(
        { _id: id, team_code: adminTeamCode },
        updates,
        { new: true }
      ).populate('team', 'full_name title');

      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Add comment (all team members)
  addComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
      }

      // Find the task first
      const existingTask = await Task.findById(id);
      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Verify user belongs to the same team
      if (existingTask.team_code !== req.user.team_code) {
        return res.status(403).json({ message: 'You can only comment on tasks from your own team' });
      }

      const task = await Task.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            comments: { 
              text, 
              user: req.user._id,
              createdAt: new Date()
            },
            activities: {
              type: 'commented',
              activity: 'Added a comment',
              by: req.user._id,
              date: new Date()
            }
          }
        },
        { new: true }
      ).populate('team comments.user', 'full_name title');

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      console.error('Comment Error:', error);
      res.status(500).json({ 
        message: 'Error adding comment',
        error: error.message 
      });
    }
  },

  // Delete task (admin only)
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const adminTeamCode = req.user.team_code;

      // Find the task first to verify team_code
      const existingTask = await Task.findById(id);
      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Verify admin belongs to the same team as the task
      if (existingTask.team_code !== adminTeamCode) {
        return res.status(403).json({ message: 'You can only delete tasks from your own team' });
      }

      const task = await Task.findOneAndUpdate(
        { _id: id, team_code: adminTeamCode },
        { isTrashed: true },
        { new: true }
      );

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get tasks assigned to a specific member
  getMemberTasks: async (req, res) => {
    try {
      const { member_id, team_code } = req.params;

      if (!member_id || !team_code) {
        return res.status(400).json({ message: 'Member ID and team code are required' });
      }

      // Verify the requesting user belongs to the same team
      if (req.user.team_code !== team_code) {
        return res.status(403).json({ message: 'You can only view tasks from your own team' });
      }

      const tasks = await Task.find({ 
        team_code,
        team: member_id,
        isTrashed: false 
      })
      .populate('team', 'full_name title')
      .sort({ createdAt: -1 });
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = taskController;
