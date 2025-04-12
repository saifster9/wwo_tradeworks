module.exports = (sequelize, DataTypes) => {
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
      tableName: 'login_attempts',
      timestamps: false // Disable createdAt/updatedAt
    });
  
    // No associations to define
    return LoginAttempt;
  };  