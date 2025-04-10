const User = require('../models/user.model');
const LoginAttempt = require('../models/login_attempt.model'); // Import the LoginAttempt model
const UserBalance = require('../models/user_balance.model'); // Import the UserBalance model
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
        res.status(500).json({ message: 'Error registering user', error });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        const ip_address = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Log unauthorized attempt
            await LoginAttempt.create({
                username: username,
                ip_address: ip_address
            });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if the user is trying to access the admin login (and is not an admin)
        if (req.body.isAdmin && !user.isAdmin) {
            // Log unauthorized attempt
            await LoginAttempt.create({
                username: username,
                ip_address: ip_address
            });
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        // Send user's first name in the response
        res.json({
            message: 'Login successful',
            isAdmin: user.isAdmin,
            firstName: user.firstName,
            userId: user.id
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};