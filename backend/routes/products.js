const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

module.exports = router;