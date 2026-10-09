const Order = require('../models/Order');

/**
 * Place a new order
 */
const createOrder = async (req, res) => {
  try {
    const { items, total, delivery_location } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderId = await Order.create({
      userId: req.user.id,
      total,
      deliveryLocation: delivery_location,
      items
    });

    res.json({
      message: '🎉 Order placed successfully!',
      order_id: orderId
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all orders (vendor, agent, admin)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error('Fetch all orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get customer-specific orders
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findByUserId(req.user.id);
    res.json(orders);
  } catch (err) {
    console.error('Fetch customer orders error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get single order details by ID
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Fetch order by id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (req, res) => {
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

    await Order.updateStatus(req.params.id, status);

    res.json({ message: 'Status updated!', status });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
