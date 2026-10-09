const { pool } = require('../database');

class User {
  /**
   * Find a user by email address
   * @param {string} email
   */
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  /**
   * Find a user by primary key ID
   * @param {number|string} id
   */
  static async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Create a new user record
   * @param {object} userData
   * @param {string} userData.name
   * @param {string} userData.email
   * @param {string} userData.password
   * @param {string} [userData.role='customer']
   */
  static async create({ name, email, password, role = 'customer' }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, role]
    );
    return result.rows[0];
  }
}

module.exports = User;
