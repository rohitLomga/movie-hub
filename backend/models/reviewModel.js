const pool = require('../config/db');

const ReviewModel = {
  // Create the reviews table
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, movie_id)
      );
    `;
    await pool.query(query);
  },

  // Get reviews for a movie (with user info)
  async findByMovieId(movieId) {
    const query = `
      SELECT r.*, u.username, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.movie_id = $1
      ORDER BY r.created_at DESC;
    `;
    const result = await pool.query(query, [movieId]);
    return result.rows;
  },

  // Create a review
  async create({ user_id, movie_id, rating, comment }) {
    const query = `
      INSERT INTO reviews (user_id, movie_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [user_id, movie_id, rating, comment]);
    return result.rows[0];
  },

  // Update a review
  async update(id, { rating, comment }) {
    const query = `
      UPDATE reviews SET rating = $1, comment = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await pool.query(query, [rating, comment, id]);
    return result.rows[0];
  },

  // Delete a review
  async delete(id) {
    const query = 'DELETE FROM reviews WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Find review by ID
  async findById(id) {
    const query = 'SELECT * FROM reviews WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Check if user already reviewed a movie
  async findByUserAndMovie(userId, movieId) {
    const query = 'SELECT * FROM reviews WHERE user_id = $1 AND movie_id = $2;';
    const result = await pool.query(query, [userId, movieId]);
    return result.rows[0];
  },

  // Get total review count
  async count() {
    const result = await pool.query('SELECT COUNT(*) FROM reviews;');
    return parseInt(result.rows[0].count);
  },
};

module.exports = ReviewModel;
