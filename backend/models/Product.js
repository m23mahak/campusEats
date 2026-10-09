const { pool } = require('../database');

class Product {
  /**
   * Fetch all products
   */
  static async findAll() {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  }

  /**
   * Fetch products filtered by category
   * @param {string} category
   */
  static async findByCategory(category) {
    const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
    return result.rows;
  }

  /**
   * Fetch single product by ID
   * @param {number|string} id
   */
  static async findById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}

module.exports = Product;
