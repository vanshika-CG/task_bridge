
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config(); // Load environment variables

const app = express();
const port = 4400;


console.log('MongoDB URI:', process.env.URI);
console.log('CLOUDINARY_API_KEY :', process.env.CLOUDINARY_API_KEY);
// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// MongoDB Atlas connection
const mongoURI = process.env.URI; 

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(' Connected to MongoDB');
}).catch(err => {
    console.error(' MongoDB connection error:', err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/file', documentRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
