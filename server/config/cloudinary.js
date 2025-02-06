const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Add console.log to debug environment variables
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Found' : 'Missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Found' : 'Missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Found' : 'Missing'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify configuration
console.log('Cloudinary Configuration Status:', cloudinary.config().cloud_name ? 'Configured' : 'Not Configured');

module.exports = cloudinary; 