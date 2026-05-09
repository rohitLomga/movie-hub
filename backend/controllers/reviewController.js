const { validationResult } = require('express-validator');
const ReviewModel = require('../models/reviewModel');
const MovieModel = require('../models/movieModel');

const reviewController = {
  // POST /api/movies/:id/reviews
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const movieId = parseInt(req.params.id);
      const userId = req.user.id;

      // Check if movie exists
      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found.' });
      }

      // Check if user already reviewed this movie
      const existingReview = await ReviewModel.findByUserAndMovie(userId, movieId);
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this movie.' });
      }

      const { rating, comment } = req.body;
      const review = await ReviewModel.create({
        user_id: userId,
        movie_id: movieId,
        rating,
        comment,
      });

      // Update movie average rating
      await MovieModel.updateRating(movieId);

      res.status(201).json({ message: 'Review added successfully!', review });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ error: 'Server error creating review.' });
    }
  },

  // PUT /api/reviews/:id
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const review = await ReviewModel.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      // Only the review author can update
      if (review.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own reviews.' });
      }

      const { rating, comment } = req.body;
      const updatedReview = await ReviewModel.update(req.params.id, { rating, comment });

      // Update movie average rating
      await MovieModel.updateRating(review.movie_id);

      res.json({ message: 'Review updated successfully!', review: updatedReview });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ error: 'Server error updating review.' });
    }
  },

  // DELETE /api/reviews/:id
  async delete(req, res) {
    try {
      const review = await ReviewModel.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      // Only the review author or admin can delete
      if (review.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You can only delete your own reviews.' });
      }

      const movieId = review.movie_id;
      await ReviewModel.delete(req.params.id);

      // Update movie average rating
      await MovieModel.updateRating(movieId);

      res.json({ message: 'Review deleted successfully!' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Server error deleting review.' });
    }
  },
};

module.exports = reviewController;
