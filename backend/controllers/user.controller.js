// controllers/user.controller.js
const { User, LoginAttempt, UserBalance } = require('../models');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { username, password, firstName, lastName, email, phoneNumber, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      phoneNumber,
      isAdmin: isAdmin || false
    });

    // Create a user balance record with initial cash_balance of 0.00
    await UserBalance.create({
      userId: newUser.id,
      cash_balance: 0.00,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Log unauthorized attempt
      await LoginAttempt.create({ username, ip_address });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check admin access
    if (req.body.isAdmin && !user.isAdmin) {
      await LoginAttempt.create({ username, ip_address });
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Successful login
    res.json({
      message: 'Login successful',
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      userId: user.id
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};