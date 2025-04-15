// wwo_tradeworks-main/backend/models/user_balance.model.js
module.exports = (sequelize, DataTypes) => {
  const UserBalance = sequelize.define('UserBalance', {
    cash_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // one balance per user
      // Foreign key constraint added by belongsTo association
    },
  }, {
    tableName: 'user_balances',
    timestamps: true, // Keeps createdAt
    updatedAt: false, // Disables updatedAt
    // Hooks removed previously as they were conflicting
  });

  // Associations
  UserBalance.associate = models => {
    // UserBalance belongs to one User
    UserBalance.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // Alias for accessing User from UserBalance
    });
  };

  return UserBalance;
};