const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    team_code: { type: String, required: true },
    full_name: { type: String, required: true },
    title: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    role:{ type: String, required: true ,enum: ['admin', 'member'] },
    password: { type: String, required: true }
});

// Add method to generate JWT token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            _id: this._id,
            role: this.role,
            email: this.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '10d' }  // Token expires in 10 days
    );
};

const User = mongoose.model('User', userSchema);

module.exports = User;