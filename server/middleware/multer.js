const multer = require('multer');
const path = require('path');

// Allowed file extensions for code files
const allowedExtensions = [
  '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', 
  '.md', '.txt', '.java', '.py', '.cpp', '.c', '.php'
];

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase(); // Convert to lowercase for safety
    if (!allowedExtensions.includes(ext)) {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
