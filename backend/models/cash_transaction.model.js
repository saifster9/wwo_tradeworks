const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model'); // Import the User model for association

const CashTransaction = sequelize.define('CashTransaction', {
    transaction_type: {
        type: DataTypes.ENUM('deposit', 'withdrawal'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    userId: { // Foreign key referencing the Users table
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, {
    tableName: 'cash_transactions',
    timestamps: false, // We are managing the transaction date ourselves
});

// Define the association with the User model
CashTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(CashTransaction, { foreignKey: 'userId', as: 'cashTransactions' });

module.exports = CashTransaction;