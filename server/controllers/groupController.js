const Group = require('../models/Group');
const Note = require('../models/Note');
const { validationResult } = require('express-validator');

// Get user's groups
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { groups }
    });

  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({
      message: 'Server error while fetching groups',
      success: false
    });
  }
};

// Create new group
const createGroup = async (req, res) => {
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

    const { name, color } = req.body;

    // Check if user already has a group with this name
    const existingGroup = await Group.findOne({
      owner: req.user._id,
      name: name.trim()
    });

    if (existingGroup) {
      return res.status(400).json({
        message: 'You already have a group with this name',
        success: false
      });
    }

    // Generate initials
    const initials = name.trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    // Create new group
    const group = new Group({
      name: name.trim(),
      color,
      initials,
      owner: req.user._id,
      members: [req.user._id]
    });

    await group.save();

    res.status(201).json({
      message: 'Group created successfully',
      success: true,
      data: { group }
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      message: 'Server error while creating group',
      success: false
    });
  }
};

// Get single group
const getGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findOne({
      _id: id,
      $or: [
        { owner: req.user._id },
        { members: req.user._id }
      ]
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
        success: false
      });
    }

    res.json({
      success: true,
      data: { group }
    });

  } catch (error) {
    console.error('Get group error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid group ID',
        success: false
      });
    }

    res.status(500).json({
      message: 'Server error while fetching group',
      success: false
    });
  }
};

// Delete group
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await Group.findOne({
      _id: id,
      owner: req.user._id // Only owner can delete
    });

    if (!group) {
      return res.status(404).json({
        message: 'Group not found or you are not authorized to delete it',
        success: false
      });
    }

    // Delete all notes in this group
    await Note.deleteMany({ group: id });

    // Delete the group
    await Group.findByIdAndDelete(id);

    res.json({
      message: 'Group and all its notes deleted successfully',
      success: true
    });

  } catch (error) {
    console.error('Delete group error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid group ID',
        success: false
      });
    }

    res.status(500).json({
      message: 'Server error while deleting group',
      success: false
    });
  }
};

module.exports = {
  getGroups,
  createGroup,
  getGroup,
  deleteGroup
};