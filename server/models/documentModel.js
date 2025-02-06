const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  cloudinary_id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  team_code: {
    type: String,
    required: true
  },
  folder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: false
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shared_with: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  last_modified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document; 