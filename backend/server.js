const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.config'); // Import sequelize instance
const userRoutes = require('./routes/user.routes'); // Import user routes
const stockRoutes = require('./routes/stock.routes'); // Import stock routes
const marketRoutes = require('./routes/market.routes'); // Import market routes
const balanceRoutes = require('./routes/balance.routes'); // Import balance routes

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes); // Use user routes
app.use('/api/stocks', stockRoutes); // Use stock routes
app.use('/api/market', marketRoutes); // Use market routes
app.use('/api/balance', balanceRoutes); // Use balance routes

// Define associations here (after models are defined)
User.hasOne(UserBalance, { foreignKey: 'user_id', as: 'balance' });
UserBalance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

sequelize.sync().then(() => console.log('Database connected!'));

app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

app.listen(5000, () => console.log('Server running on port 5000'));