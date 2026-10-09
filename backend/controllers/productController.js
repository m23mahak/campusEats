const Product = require('../models/Product');

/**
 * Get all products with optional category filter
 */
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category && category !== 'all') {
      products = await Product.findByCategory(category);
    } else {
      products = await Product.findAll();
    }

    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get single product by ID
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Fetch product error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById
};
