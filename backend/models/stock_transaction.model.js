const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');
const Stock = require('./stock.model');

const StockTransaction = sequelize.define('StockTransaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  stockId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Stock, key: 'id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  pricePerShare: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  transactionType: { type: DataTypes.ENUM('buy','sell'), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'stock_transactions',
  updatedAt: false
});

StockTransaction.belongsTo(User, { foreignKey: 'userId' });
StockTransaction.belongsTo(Stock, { foreignKey: 'stockId'});
User.hasMany(StockTransaction, { foreignKey: 'userId', as: 'stockTransactions' });
Stock.hasMany(StockTransaction, { foreignKey: 'stockId', as: 'transactions' });

module.exports = StockTransaction;