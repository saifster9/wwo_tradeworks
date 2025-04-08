const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model'); // Import the User model for association

const UserBalance = sequelize.define('UserBalance', {
    cash_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    userId: { // Foreign key referencing the Users table
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        unique: true, // Assuming one balance record per user
    },
}, {
    tableName: 'user_balances',
    timestamps: true, // Keep timestamps for audit purposes
    updatedAt: false, // We only care about creation time for this initial setup

    hooks: {
        beforeUpdate: async (userBalance, options) => {
            if (options.transactionType === 'withdrawal' && parseFloat(options.amount) > parseFloat(userBalance.cash_balance)) {
                throw new Error('Insufficient funds for withdrawal.');
            }
            if (options.transactionType === 'deposit') {
                userBalance.cash_balance = parseFloat(userBalance.cash_balance) + parseFloat(options.amount);
            } else if (options.transactionType === 'withdrawal') {
                userBalance.cash_balance = parseFloat(userBalance.cash_balance) - parseFloat(options.amount);
            }
        },
    }
});

// Define the association with the User model
UserBalance.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(UserBalance, { foreignKey: 'userId', as: 'balance' });

module.exports = UserBalance;