const express = require('express');
const { body } = require('express-validator');
const movieController = require('../controllers/movieController');
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');

const router = express.Router();

// GET /api/movies/stats/overview (must be before /:id)
router.get('/stats/overview', auth, adminCheck, movieController.getStats);

// GET /api/movies
router.get('/', movieController.getAll);

// GET /api/movies/:id
router.get('/:id', movieController.getById);

// POST /api/movies (Admin only)
router.post(
  '/',
  auth,
  adminCheck,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('genre').trim().notEmpty().withMessage('Genre is required.'),
  ],
  movieController.create
);

// PUT /api/movies/:id (Admin only)
router.put(
  '/:id',
  auth,
  adminCheck,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
  ],
  movieController.update
);

// DELETE /api/movies/:id (Admin only)
router.delete('/:id', auth, adminCheck, movieController.delete);

// POST /api/movies/:id/reviews (Authenticated)
router.post(
  '/:id/reviews',
  auth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
    body('comment').trim().isLength({ min: 5 }).withMessage('Comment must be at least 5 characters.'),
  ],
  reviewController.create
);

module.exports = router;
