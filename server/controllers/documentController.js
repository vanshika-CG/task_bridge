const Document = require('../models/documentModel');
const Folder = require('../models/folderModel');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/multer');

exports.uploadDocument = async (req, res) => {
  try {
    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: `team_${req.body.team_code}`
    });

    const newDocument = new Document({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      cloudinary_id: result.public_id,
      url: result.secure_url,
      team_code: req.body.team_code,
      folder_id: req.body.folder_id || null,
      uploaded_by: req.user._id
    });

    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ team_code: req.params.team_code })
      .populate('uploaded_by', 'full_name')
      .populate('folder_id', 'name')
      .sort({ last_modified: -1 });
    
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      message: error.message || 'Error fetching documents',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.deleteDocument = async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: 'Document not found' });
      }
      
      // Check user permissions
      if (document.uploaded_by.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this document' });
      }
      
      // Delete from cloudinary
      await cloudinary.uploader.destroy(document.cloudinary_id);
      
      // Delete from database
      await document.deleteOne();
      
      res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error deleting document',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

exports.shareDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    document.shared_with.push(req.body.user_id);
    await document.save();
    
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 