const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// PUT /api/reviews/:id
router.put(
  '/:id',
  auth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters.'),
  ],
  reviewController.update
);

// DELETE /api/reviews/:id
router.delete('/:id', auth, reviewController.delete);

module.exports = router;
