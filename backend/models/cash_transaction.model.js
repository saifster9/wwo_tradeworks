// wwo_tradeworks-main/backend/models/cash_transaction.model.js
module.exports = (sequelize, DataTypes) => {
  const CashTransaction = sequelize.define('CashTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
      // Foreign key constraint is implicitly added by belongsTo
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

  // Define associations in a static associate method
  CashTransaction.associate = models => {
    // CashTransaction belongs to one User
    CashTransaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // Alias for accessing the User from a CashTransaction instance
    });
  };

  return CashTransaction;
};