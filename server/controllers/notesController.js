const Note = require('../models/Note');
const Group = require('../models/Group');
const { validationResult } = require('express-validator');

// Get notes for a group
const getGroupNotes = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Check if user has access to this group
    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found or access denied',
        success: false
      });
    }

    // Get notes for this group
    const notes = await Note.find({ group: groupId })
      .populate('author', 'username')
      .sort({ createdAt: 1 }); // Oldest first for chat-like display

    res.json({
      success: true,
      data: { notes }
    });

  } catch (error) {
    console.error('Get group notes error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid group ID',
        success: false
      });
    }

    res.status(500).json({
      message: 'Server error while fetching notes',
      success: false
    });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        success: false
      });
    }

    const { groupId } = req.params;
    const { text } = req.body;

    // Check if user has access to this group
    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found or access denied',
        success: false
      });
    }

    // Create new note
    const note = new Note({
      text: text.trim(),
      group: groupId,
      author: req.user._id
    });

    await note.save();

    // Populate author info for response
    await note.populate('author', 'username');

    res.status(201).json({
      message: 'Note created successfully',
      success: true,
      data: { note }
    });

  } catch (error) {
    console.error('Create note error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid group ID',
        success: false
      });
    }

    res.status(500).json({
      message: 'Server error while creating note',
      success: false
    });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
        success: false
      });
    }

    const { id } = req.params;
    const { text } = req.body;

    // Find note and check if user is the author
    const note = await Note.findOne({
      _id: id,
      author: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found or you are not authorized to edit it',
        success: false
      });
    }

    // Update note
    note.text = text.trim();
    await note.save();

    // Populate author info for response
    await note.populate('author', 'username');

    res.json({
      message: 'Note updated successfully',
      success: true,
      data: { note }
    });

  } catch (error) {
    console.error('Update note error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid note ID',
        success: false
      });
    }

    res.status(500).json({
      message: 'Server error while updating note',
      success: false
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Find note and check if user is the author
    const note = await Note.findOne({
      _id: id,
      author: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        message: 'Note not found or you are not authorized to delete it',
        success: false
      });
    }

    await Note.findByIdAndDelete(id);

    res.json({
      message: 'Note deleted successfully',
      success: true
    });

  } catch (error) {
    console.error('Delete note error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid note ID',
        success: false
      });
    }

    res.status(500).json({
      message: 'Server error while deleting note',
      success: false
    });
  }
};

module.exports = {
  getGroupNotes,
  createNote,
  updateNote,
  deleteNote
};