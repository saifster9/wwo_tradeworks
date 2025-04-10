const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');
const Stock = require('./stock.model');

const UserHolding = sequelize.define('UserHolding',{
  id:{ type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
  userId:{ type:DataTypes.INTEGER, allowNull:false, references:{ model:User, key:'id' } },
  stockId:{ type:DataTypes.INTEGER, allowNull:false, references:{ model:Stock, key:'id' } },
  shares:{ type:DataTypes.INTEGER, allowNull:false, defaultValue:0 }
},{
  tableName:'user_holdings',
  timestamps:false
});

UserHolding.belongsTo(User,{ foreignKey:'userId' });
UserHolding.belongsTo(Stock,{ foreignKey:'stockId' });
User.hasMany(UserHolding,{ foreignKey:'userId', as:'holdings' });
Stock.hasMany(UserHolding,{ foreignKey:'stockId', as:'holders' });

module.exports = UserHolding;