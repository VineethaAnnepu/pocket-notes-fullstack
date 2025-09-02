const express = require('express');
const { body } = require('express-validator');
const notesController = require('../controllers/notesController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation middlewares
const noteValidation = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Note text must be between 1 and 5000 characters')
];

// Routes
router.get('/group/:groupId', notesController.getGroupNotes);
router.post('/group/:groupId', noteValidation, notesController.createNote);
router.put('/:id', noteValidation, notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;