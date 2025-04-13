// Updated code for db.config.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Keep this if you use .env locally

const sequelize = new Sequelize(
    process.env.DB_NAME,     // Your Azure DB name
    process.env.DB_USER,     // Your Azure DB username (e.g., username@hostname)
    process.env.DB_PASS,     // Your Azure DB password
    {
        host: process.env.DB_HOST, // Your Azure DB hostname (e.g., your-server-name.mysql.database.azure.com)
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                // Setting rejectUnauthorized to false is generally NOT recommended for production
                // but can be necessary if the CA certificate isn't automatically trusted.
                // Try with require: true first. If it fails, you might need to handle the CA cert.
                // rejectUnauthorized: false // Use with caution, only if necessary and you understand the risk
                rejectUnauthorized: true // Recommended setting
            }
        }
    }
);

module.exports = sequelize;