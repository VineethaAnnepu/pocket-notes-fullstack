const express = require('express');
const { body } = require('express-validator');
const groupController = require('../controllers/groupController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middlewares
const createGroupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Group name must be between 2 and 30 characters'),

  body('color')
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Please provide a valid hex color code')
];

// Routes
router.get('/', groupController.getGroups);
router.post('/', createGroupValidation, groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;