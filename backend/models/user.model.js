module.exports = (sequelize, DataTypes) => {
  // Helper function to clean phone number (keep only digits)
  const cleanPhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string') {
      return null; // Return null if input is invalid/empty
    }
    // Keep only digits, return null if result is empty after cleaning
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length > 0 ? cleaned : null;
  };

  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
      // Add validation if needed, e.g., min/max length
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
      validate: { // Example basic email validation
        isEmail: true,
      }
    },
    phoneNumber: {
      type: DataTypes.STRING, // Store cleaned digits as a string
      unique: true,
      allowNull: false,
      // --- NEW: Setter for phoneNumber ---
      set(value) {
        // Automatically clean the phone number whenever this field is set
        // on a User instance (e.g., during User.create or user.update)
        // This ensures only digits (or null) are stored in the database.
        this.setDataValue('phoneNumber', cleanPhoneNumber(value));
      },
      // --- END: Setter ---
      validate: {
         // Optional: Add validation to ensure it's exactly 10 digits after cleaning
         isTenDigits(value) {
            // The value passed here *should* already be cleaned by the setter
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
    timestamps: true // or false if you prefer no timestamps
  });

  // Associations will be added in other models' associate methods
  // UserBalance association (ensure this exists if UserBalance model defines it too)
   User.hasOne(sequelize.models.UserBalance, { // Access UserBalance via sequelize.models if needed here
      foreignKey: 'userId',
      as: 'balance'
   });
   // CashTransaction association
   User.hasMany(sequelize.models.CashTransaction, {
       foreignKey: 'userId',
       as: 'cashTransactions'
   });
   // StockTransaction association
    User.hasMany(sequelize.models.StockTransaction, {
       foreignKey: 'userId',
       as: 'stockTransactions'
   });
    // UserHolding association
    User.hasMany(sequelize.models.UserHolding, {
       foreignKey: 'userId',
       as: 'holdings'
   });


  return User;
};