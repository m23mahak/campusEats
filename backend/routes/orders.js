const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../database');

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware to check login
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Please login first' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to check role
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

// PLACE ORDER
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, total, delivery_location } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total, delivery_location, status) VALUES ($1, $2, $3, $4) RETURNING id',
      [req.user.id, total, delivery_location || 'Campus', 'pending']
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_name, price, quantity, emoji) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.name, item.price, item.qty, item.emoji]
      );
    }

    res.json({
      message: '🎉 Order placed successfully!',
      order_id: orderId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all orders (for vendor and admin)
router.get('/all', authMiddleware, requireRole(['vendor', 'admin']), async (req, res) => {
  try {
    const ordersResult = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = ordersResult.rows;

    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      return { ...order, items: itemsResult.rows };
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET my orders (for customer)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    const orders = ordersResult.rows;

    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      return { ...order, items: itemsResult.rows };
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    const order = orderResult.rows[0];

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);

    res.json({ ...order, items: itemsResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE order status
router.patch('/:id/status', authMiddleware, requireRole(['vendor', 'agent', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'preparing',
      'on_the_way',
      'delivered',
      'rejected'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, req.params.id]);

    res.json({ message: 'Status updated!', status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;