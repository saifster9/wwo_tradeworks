module.exports = (sequelize, DataTypes) => {
    const MarketSchedule = sequelize.define('MarketSchedule', {
      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      open_time: {
        type: DataTypes.TIME
      },
      close_time: {
        type: DataTypes.TIME
      },
      isTradingDay: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'market_schedule',
      timestamps: false
    });
  
    return MarketSchedule;
  }; 