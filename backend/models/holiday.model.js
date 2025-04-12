module.exports = (sequelize, DataTypes) => {
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
      timestamps: false // Disable createdAt/updatedAt
    });
  
    // No associations to define here
    return Holiday;
  };  