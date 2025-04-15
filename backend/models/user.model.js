// wwo_tradeworks-main/backend/models/user.model.js
module.exports = (sequelize, DataTypes) => {
  // Helper function to clean phone number (keep only digits)
  const cleanPhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') {
      return null; // Return null if input is invalid/empty
    }
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length > 0 ? cleaned : null;
  };

  const User = sequelize.define('User', {
    // ... (id, username, password, firstName, lastName, email fields) ...
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        this.setDataValue('phoneNumber', cleanPhoneNumber(value));
      },
      validate: {
         isTenDigits(value) {
            if (value && value.length !== 10) {
                 throw new Error('Phone number must contain exactly 10 digits.');
            }
         }
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  // --- CORRECTED: Define associations in a static associate method ---
  User.associate = (models) => {
    // models object contains all loaded models (User, UserBalance, etc.)
    // Define associations here using the 'models' argument

    // User has one UserBalance
    User.hasOne(models.UserBalance, {
      foreignKey: 'userId',
      as: 'balance'
      // onDelete: 'CASCADE' // Optional: Add if you want balance deleted when user is deleted
    });

    // User has many CashTransactions
    User.hasMany(models.CashTransaction, {
      foreignKey: 'userId',
      as: 'cashTransactions'
      // onDelete: 'CASCADE' // Optional: Add if you want transactions deleted when user is deleted
    });

    // User has many StockTransactions
    User.hasMany(models.StockTransaction, {
      foreignKey: 'userId',
      as: 'stockTransactions'
      // onDelete: 'CASCADE' // Optional
    });

    // User has many UserHoldings
    User.hasMany(models.UserHolding, {
      foreignKey: 'userId',
      as: 'holdings'
      // onDelete: 'CASCADE' // Optional
    });

    // Add other associations like belongsToMany if needed
  };
  // --- END Association Definition ---

  return User;
};