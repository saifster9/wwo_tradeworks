module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
      companyName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stockTicker: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      totalSharesAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      initialSharePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      }
    }, {
      tableName: 'stocks',
      timestamps: false
    });
  
    return Stock;
  };