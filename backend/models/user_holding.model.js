const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User      = require('./user.model');
const Stock     = require('./stock.model');

const UserHolding = sequelize.define('UserHolding', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Stock, key: 'id' }
  },
  shares: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'user_holdings',
  timestamps: false
});

// Associations
UserHolding.belongsTo(User,  { foreignKey: 'userId', as: 'user' });
UserHolding.belongsTo(Stock, { foreignKey: 'stockId', as: 'stock' });

module.exports = UserHolding;