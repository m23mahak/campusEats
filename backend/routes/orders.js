const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Order routes
router.post('/', authMiddleware, orderController.createOrder);
router.get('/all', authMiddleware, requireRole(['vendor', 'agent', 'admin']), orderController.getAllOrders);
router.get('/my', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.patch('/:id/status', authMiddleware, requireRole(['vendor', 'agent', 'admin']), orderController.updateOrderStatus);

module.exports = router;