const express = require('express');
const router = express.Router();
const { pool } = require('../database');

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category && category !== 'all') {
      const result = await pool.query('SELECT * FROM products WHERE category = $1', [category]);
      products = result.rows;
    } else {
      const result = await pool.query('SELECT * FROM products');
      products = result.rows;
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const product = result.rows[0];

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;