const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const LoginAttempt = sequelize.define('LoginAttempt', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'login_attempts', // Ensure table name is explicitly set
    timestamps: false          // Disable Sequelize's default timestamps
});

module.exports = LoginAttempt;