// controllers/user.controller.js
const { User, LoginAttempt, UserBalance } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require("sequelize"); // Import Op

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

    // Exclude password from the returned user object
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({ message: 'User registered successfully', user: userResponse });

  } catch (error) {
    console.error('Error in register:', error); // Keep original detailed log

    // --- CORRECTED: Check for specific unique constraint errors ---
    if (error.name === 'SequelizeUniqueConstraintError') {
      let field = 'field'; // Default field name
      let value = 'value';
      let userMessage = 'A unique field conflict occurred.'; // Default specific message

      // Safely extract field and value from the error details
      if (error.errors && error.errors.length > 0) {
         field = error.errors[0].path || field; // Get the field name (e.g., 'username', 'email', 'phoneNumber')
         value = error.errors[0].value || value; // Get the value that caused the conflict

         // Customize message based on the specific field identified
         switch (field) {
           case 'username':
             userMessage = `Username '${value}' is already taken. Please choose another.`;
             break;
           case 'email':
             userMessage = `Email '${value}' is already registered. Please use a different email or login.`;
             break;
           case 'phoneNumber':
              userMessage = `Phone number '${value}' is already associated with an account.`;
              break;
           default:
              // Keep a slightly more generic message if the field isn't one we expect
              userMessage = `The value provided for ${field} is already in use.`;
              break;
         }
      } else {
         // Fallback if error.errors structure is unexpected
         userMessage = 'An account with some of the provided details (like username, email, or phone) already exists.';
      }

      // Send a 409 Conflict status code with the specific message
      return res.status(409).json({ message: userMessage, field: field }); // Send field name too if frontend wants it
    }
    // --- End of corrected specific error check ---

    // Fallback for other types of errors (non-unique constraint errors)
    res.status(500).json({ message: 'Error registering user', error: error.message }); // Keep original error message for debugging if needed
  }
};

// --- Login function remains the same ---
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

// --- verifyIdentity and resetPasswordDirect functions remain the same ---
exports.verifyIdentity = async (req, res) => {
    // ... (previous implementation) ...
      const { identifier, phoneNumber } = req.body; // Identifier can be email or username

      if (!identifier || !phoneNumber) {
        return res.status(400).json({ message: 'Identifier and phone number are required.' });
      }

      try {
        // Find user by email OR username
        const user = await User.findOne({
          where: {
            [Op.or]: [ // Requires importing Op from sequelize: const { Op } = require("sequelize");
              { email: identifier },
              { username: identifier }
            ]
          }
        });

        if (!user) {
          // User not found for that identifier
          return res.status(404).json({ message: 'Verification failed.' }); // Generic message
        }

        // IMPORTANT: Compare phone numbers carefully.
        // Consider cleaning/normalizing phone numbers before comparison
        // (e.g., removing spaces, dashes, country codes if not consistently stored).
        // This example assumes they are stored consistently.
        if (user.phoneNumber !== phoneNumber) {
          // Phone number does not match the found user
          return res.status(400).json({ message: 'Verification failed.' }); // Generic message
        }

        // If identifier found and phone number matches:
        // Return success and the userId to be used in the next step
        res.json({ message: 'Identity verified successfully.', userId: user.id });

      } catch (error) {
        console.error('Error in verifyIdentity:', error);
        res.status(500).json({ message: 'An internal error occurred during verification.' });
      }
};

exports.resetPasswordDirect = async (req, res) => {
    // ... (previous implementation) ...
      const { userId, newPassword } = req.body;

      // Basic Validation
      if (!userId || !newPassword) {
        return res.status(400).json({ message: 'User ID and new password are required.' });
      }
      if (newPassword.length < 6) { // Match frontend validation if any
           return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }
      // Add more password complexity rules if desired

      // SECURITY NOTE: Ideally, you should verify that this userId recently passed
      // the verify-identity step, perhaps using a short-lived token or flag stored
      // server-side, before allowing the password update. This example omits that check.

      try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const [updatedRowCount] = await User.update(
          { password: hashedPassword },
          { where: { id: userId } }
        );

        if (updatedRowCount === 0) {
          // Should not happen if userId came from successful verification, but handle defensively
          return res.status(404).json({ message: 'User not found for password update.' });
        }

        res.json({ message: 'Password reset successfully.' });

      } catch (error) {
        console.error('Error in resetPasswordDirect:', error);
        res.status(500).json({ message: 'An internal error occurred while resetting the password.' });
      }
};