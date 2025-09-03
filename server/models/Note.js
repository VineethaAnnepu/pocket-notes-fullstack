const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Note text is required'],
    trim: true,
    maxlength: [5000, 'Note cannot exceed 5000 characters']
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
noteSchema.index({ group: 1, createdAt: -1 });
noteSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);