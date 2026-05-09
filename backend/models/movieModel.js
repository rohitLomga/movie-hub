const pool = require('../config/db');

const MovieModel = {
  // Create the movies table
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        genre VARCHAR(100),
        release_year INTEGER,
        director VARCHAR(100),
        cast_members TEXT,
        poster_url TEXT,
        trailer_url TEXT,
        duration INTEGER,
        avg_rating DECIMAL(3,2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  },

  // Get all movies with optional search, filter, and sort
  async findAll({ search, genre, sort, page = 1, limit = 12 }) {
    let query = 'SELECT * FROM movies WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(director) LIKE $${paramIndex})`;
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    if (genre) {
      query += ` AND LOWER(genre) = $${paramIndex}`;
      params.push(genre.toLowerCase());
      paramIndex++;
    }

    // Sorting
    switch (sort) {
      case 'rating_desc':
        query += ' ORDER BY avg_rating DESC';
        break;
      case 'rating_asc':
        query += ' ORDER BY avg_rating ASC';
        break;
      case 'year_desc':
        query += ' ORDER BY release_year DESC';
        break;
      case 'year_asc':
        query += ' ORDER BY release_year ASC';
        break;
      case 'title_asc':
        query += ' ORDER BY title ASC';
        break;
      default:
        query += ' ORDER BY created_at DESC';
    }

    // Pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Count total movies (for pagination)
  async count({ search, genre }) {
    let query = 'SELECT COUNT(*) FROM movies WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (LOWER(title) LIKE $${paramIndex} OR LOWER(director) LIKE $${paramIndex})`;
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    if (genre) {
      query += ` AND LOWER(genre) = $${paramIndex}`;
      params.push(genre.toLowerCase());
      paramIndex++;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  },

  // Find movie by ID
  async findById(id) {
    const query = 'SELECT * FROM movies WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create a new movie
  async create({ title, description, genre, release_year, director, cast_members, poster_url, trailer_url, duration }) {
    const query = `
      INSERT INTO movies (title, description, genre, release_year, director, cast_members, poster_url, trailer_url, duration)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const result = await pool.query(query, [title, description, genre, release_year, director, cast_members, poster_url, trailer_url, duration]);
    return result.rows[0];
  },

  // Update a movie
  async update(id, { title, description, genre, release_year, director, cast_members, poster_url, trailer_url, duration }) {
    const query = `
      UPDATE movies SET
        title = $1, description = $2, genre = $3, release_year = $4,
        director = $5, cast_members = $6, poster_url = $7, trailer_url = $8,
        duration = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *;
    `;
    const result = await pool.query(query, [title, description, genre, release_year, director, cast_members, poster_url, trailer_url, duration, id]);
    return result.rows[0];
  },

  // Delete a movie
  async delete(id) {
    const query = 'DELETE FROM movies WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Update average rating
  async updateRating(movieId) {
    const query = `
      UPDATE movies SET
        avg_rating = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE movie_id = $1), 0),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE movie_id = $1)
      WHERE id = $1
      RETURNING avg_rating, total_reviews;
    `;
    const result = await pool.query(query, [movieId]);
    return result.rows[0];
  },

  // Get all unique genres
  async getGenres() {
    const query = "SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL ORDER BY genre;";
    const result = await pool.query(query);
    return result.rows.map(r => r.genre);
  },
};

module.exports = MovieModel;
