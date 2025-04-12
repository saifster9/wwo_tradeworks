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
      // we'll set up the association in the `associate` method below
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
    // models.User will be available after all models are initialized
    CashTransaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    models.User.hasMany(CashTransaction, {
      foreignKey: 'userId',
      as: 'cashTransactions'
    });
  };

  return CashTransaction;
};