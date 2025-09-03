const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    minlength: [2, 'Group name must be at least 2 characters'],
    maxlength: [30, 'Group name cannot exceed 30 characters']
  },
  color: {
    type: String,
    required: [true, 'Group color is required'],
    match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color']
  },
  initials: {
    type: String,
    required: true,
    maxlength: 2
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for faster queries
groupSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model('Group', groupSchema);