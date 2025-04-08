const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Holiday = sequelize.define('Holiday', {
    holiday_date: {
        type: DataTypes.DATEONLY, // Store only the date
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'holidays',
    timestamps: false // Disable timestamps (createdAt, updatedAt)
});

module.exports = Holiday;