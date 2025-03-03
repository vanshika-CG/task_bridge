// routes/teamRoutes.js
const express = require('express');
const teamRouter = express.Router();
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth'); // Authentication middleware
const adminAuth = require('../middleware/adminAuth'); // Admin authorization middleware

teamRouter.get('/:team_code', teamController.getTeamMembers);
teamRouter.post('/new_user', teamController.addUser);
teamRouter.patch('/user/:full_name/:team_code/edit', teamController.editUser);
teamRouter.delete('/user/:full_name/:team_code/delete', teamController.deleteUser);
teamRouter.post('/import-members',auth , adminAuth , teamController.importMembers);

module.exports = teamRouter;