const express = require('express');
const { signup, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
// Add protected route example
authRouter.get('/profile', auth, (req, res) => {
    res.json({ user: req.user });
});

module.exports = authRouter;
