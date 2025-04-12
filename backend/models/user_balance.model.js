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
      },
    }, {
      tableName: 'user_balances',
      timestamps: true,
      updatedAt: false,
  
      hooks: {
        beforeUpdate: async (userBalance, options) => {
          const { transactionType, amount } = options;
          const current = parseFloat(userBalance.cash_balance);
          const amt     = parseFloat(amount);
  
          if (transactionType === 'withdrawal' && amt > current) {
            throw new Error('Insufficient funds for withdrawal.');
          }
  
          // Adjust balance
          userBalance.cash_balance =
            transactionType === 'deposit'
              ? current + amt
              : current - amt;
        },
      },
    });
  
    // Associations
    UserBalance.associate = models => {
      const { User } = models;
      UserBalance.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
      });
      User.hasOne(UserBalance, {
        foreignKey: 'userId',
        as: 'balance'
      });
    };
  
    return UserBalance;
  };  