const pool = require('../config/db');

const UserModel = {
  // Create the users table
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
  },

  // Create a new user
  async create({ username, email, password, role = 'user' }) {
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, avatar_url, created_at;
    `;
    const result = await pool.query(query, [username, email, password, role]);
    return result.rows[0];
  },

  // Find user by email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Find user by ID
  async findById(id) {
    const query = 'SELECT id, username, email, role, avatar_url, created_at FROM users WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get total user count
  async count() {
    const result = await pool.query('SELECT COUNT(*) FROM users;');
    return parseInt(result.rows[0].count);
  },
};

module.exports = UserModel;
