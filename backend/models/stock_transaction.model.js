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

  // Define associations in a static method
  StockTransaction.associate = models => {
    const { User, Stock } = models;
    StockTransaction.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });
    StockTransaction.belongsTo(Stock, {
      foreignKey: 'stockId',
      as: 'stock'
    });
    User.hasMany(StockTransaction, {
      foreignKey: 'userId',
      as: 'stockTransactions'
    });
    Stock.hasMany(StockTransaction, {
      foreignKey: 'stockId',
      as: 'transactions'
    });
  };

  return StockTransaction;
};