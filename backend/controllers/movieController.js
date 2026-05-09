const { validationResult } = require('express-validator');
const MovieModel = require('../models/movieModel');
const UserModel = require('../models/userModel');
const ReviewModel = require('../models/reviewModel');

const movieController = {
  // GET /api/movies
  async getAll(req, res) {
    try {
      const { search, genre, sort, page = 1, limit = 12 } = req.query;
      const movies = await MovieModel.findAll({ search, genre, sort, page: parseInt(page), limit: parseInt(limit) });
      const total = await MovieModel.count({ search, genre });
      const genres = await MovieModel.getGenres();

      res.json({
        movies,
        genres,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Get movies error:', error);
      res.status(500).json({ error: 'Server error fetching movies.' });
    }
  },

  // GET /api/movies/:id
  async getById(req, res) {
    try {
      const movie = await MovieModel.findById(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found.' });
      }

      const reviews = await ReviewModel.findByMovieId(req.params.id);

      res.json({ movie, reviews });
    } catch (error) {
      console.error('Get movie error:', error);
      res.status(500).json({ error: 'Server error fetching movie.' });
    }
  },

  // POST /api/movies (Admin only)
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const movie = await MovieModel.create(req.body);
      res.status(201).json({ message: 'Movie created successfully!', movie });
    } catch (error) {
      console.error('Create movie error:', error);
      res.status(500).json({ error: 'Server error creating movie.' });
    }
  },

  // PUT /api/movies/:id (Admin only)
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existing = await MovieModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Movie not found.' });
      }

      const movie = await MovieModel.update(req.params.id, req.body);
      res.json({ message: 'Movie updated successfully!', movie });
    } catch (error) {
      console.error('Update movie error:', error);
      res.status(500).json({ error: 'Server error updating movie.' });
    }
  },

  // DELETE /api/movies/:id (Admin only)
  async delete(req, res) {
    try {
      const existing = await MovieModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Movie not found.' });
      }

      await MovieModel.delete(req.params.id);
      res.json({ message: 'Movie deleted successfully!' });
    } catch (error) {
      console.error('Delete movie error:', error);
      res.status(500).json({ error: 'Server error deleting movie.' });
    }
  },

  // GET /api/movies/stats/overview (Admin)
  async getStats(req, res) {
    try {
      const totalMovies = await MovieModel.count({});
      const totalReviews = await ReviewModel.count();
      const totalUsers = await UserModel.count();
      const genres = await MovieModel.getGenres();

      res.json({
        totalMovies,
        totalReviews,
        totalUsers,
        totalGenres: genres.length,
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Server error fetching stats.' });
    }
  },
};

module.exports = movieController;
