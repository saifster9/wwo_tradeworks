// wwo_tradeworks-main/backend/models/stock_transaction.model.js
module.exports = (sequelize, DataTypes) => {
  const StockTransaction = sequelize.define('StockTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pricePerShare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    transactionType: {
      type: DataTypes.ENUM('buy', 'sell'),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'stock_transactions',
    updatedAt: false
  });

  // Define associations in a static associate method
  StockTransaction.associate = models => {
    // A StockTransaction belongs to one User
    StockTransaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // Alias for accessing the User from StockTransaction
    });

    // A StockTransaction belongs to one Stock
    StockTransaction.belongsTo(models.Stock, {
      foreignKey: 'stockId',
      as: 'Stock' // Alias for accessing the Stock from StockTransaction (Note: 'Stock' might conflict with model name, consider 'stock'?)
    });
  };

  return StockTransaction;
};
