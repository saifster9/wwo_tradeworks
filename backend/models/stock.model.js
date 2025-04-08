const { DataTypes } = require('sequelize');
  const sequelize = require('../config/db.config');

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
          type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
          allowNull: false
      }
  }, {
      tableName: 'stocks', // Make sure this matches your table name
      timestamps: false
  });

  module.exports = Stock;