const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const UserBalance = sequelize.define('UserBalance', {
    cash_balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}, {
    tableName: 'user_balances',
    timestamps: false, // We don't need createdAt/updatedAt
    primaryKey: true, // We will set primaryKey later
    foreignKey: 'user_id' // Explicit foreign key name
});

module.exports = UserBalance;