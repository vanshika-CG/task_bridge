const express = require('express');
const documentRouter = express.Router();
const documentController = require('../controllers/documentController');
const folderController = require('../controllers/folderController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// Validation middleware
const validateUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  if (!req.body.team_code) {
    return res.status(400).json({ message: 'Team code is required' });
  }
  next();
};

// Folder routes
documentRouter.post('/folder', auth, folderController.createFolder);
documentRouter.get('/folder/:team_code', auth, folderController.getFolders);

// Document routes
documentRouter.post('/upload', 
  auth, 
  upload.single('file'), 
  validateUpload, 
  documentController.uploadDocument
);

// Get all documents for a team
documentRouter.get('/team/:team_code', auth, documentController.getDocuments);

// Delete document
documentRouter.delete('/:id', auth, documentController.deleteDocument);

// Share document
documentRouter.post('/:id/share', auth, documentController.shareDocument);

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

documentRouter.use(errorHandler);

module.exports = documentRouter; 