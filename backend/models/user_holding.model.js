module.exports = (sequelize, DataTypes) => {
  const UserHolding = sequelize.define('UserHolding', {
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
    shares: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'user_holdings',
    timestamps: false
  });

  UserHolding.associate = models => {
    const { User, Stock } = models;
    UserHolding.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });
    UserHolding.belongsTo(Stock, {
      foreignKey: 'stockId',
      as: 'stock'
    });
  };

  return UserHolding;
};