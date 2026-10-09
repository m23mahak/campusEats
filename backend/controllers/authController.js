const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SECRET } = require('../middleware/authMiddleware');

/**
 * Handle user registration
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const assignedRole = role || 'customer';
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: assignedRole
    });

    const token = jwt.sign(
      { id: newUser.id, role: assignedRole },
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: assignedRole
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Handle user login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login
};
