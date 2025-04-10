const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const CashTransaction = sequelize.define('CashTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  transactionType: {
    type: DataTypes.ENUM('deposit', 'withdrawal'),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'cash_transactions',
  updatedAt: false
});

// Associations
CashTransaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(CashTransaction, { foreignKey: 'userId', as: 'cashTransactions' });

module.exports = CashTransaction;
