const { pool } = require('../database');

class Order {
  /**
   * Create an order with items within a database transaction
   * @param {object} orderData
   * @param {number|string} orderData.userId
   * @param {number} orderData.total
   * @param {string} orderData.deliveryLocation
   * @param {Array} orderData.items
   */
  static async create({ userId, total, deliveryLocation, items }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        'INSERT INTO orders (user_id, total, delivery_location, status) VALUES ($1, $2, $3, $4) RETURNING id',
        [userId, total, deliveryLocation || 'Campus', 'pending']
      );

      const orderId = orderResult.rows[0].id;

      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_name, price, quantity, emoji) VALUES ($1, $2, $3, $4, $5)',
          [orderId, item.name, item.price, item.qty, item.emoji]
        );
      }

      await client.query('COMMIT');
      return orderId;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Fetch all orders with associated items ordered by created_at desc
   */
  static async findAll() {
    const ordersResult = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = ordersResult.rows;

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        return { ...order, items: itemsResult.rows };
      })
    );

    return ordersWithItems;
  }

  /**
   * Fetch all orders for a specific user with associated items
   * @param {number|string} userId
   */
  static async findByUserId(userId) {
    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    const orders = ordersResult.rows;

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        return { ...order, items: itemsResult.rows };
      })
    );

    return ordersWithItems;
  }

  /**
   * Fetch a single order with items by order ID
   * @param {number|string} id
   */
  static async findById(id) {
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    const order = orderResult.rows[0];

    if (!order) return null;

    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    return { ...order, items: itemsResult.rows };
  }

  /**
   * Update the status of an order
   * @param {number|string} id
   * @param {string} status
   */
  static async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );
    return result.rows[0] || null;
  }
}

module.exports = Order;
