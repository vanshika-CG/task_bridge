const express = require('express');
const taskRoutes = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth'); // Authentication middleware
const adminAuth = require('../middleware/adminAuth'); // Admin authorization middleware

// Public routes (accessible by all team members)
taskRoutes.get('/:team_code', auth, taskController.getAllTasks);
taskRoutes.get('/stage/:stage/:team_code', auth, taskController.getTasksByStage);
taskRoutes.get('/member/:member_id/:team_code', auth, taskController.getMemberTasks);

// Admin only routes
taskRoutes.post('/', auth, adminAuth, taskController.createTask);
taskRoutes.patch('/:id', auth, adminAuth, taskController.updateTask);
taskRoutes.delete('/delete/:id', auth, adminAuth, taskController.deleteTask);

// Team member routes (for comments only)
taskRoutes.post('/:id/comments', auth, taskController.addComment);

module.exports = taskRoutes;