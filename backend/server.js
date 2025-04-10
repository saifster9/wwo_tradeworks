const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.config');
const userRoutes = require('./routes/user.routes');
const stockRoutes = require('./routes/stock.routes');
const marketRoutes = require('./routes/market.routes');
const userBalanceRoutes = require('./routes/userBalance.routes'); 
const MarketSchedule = require('./models/market_schedule.model');
const defaultMarketSchedule = require('./data/defaultMarketSchedule');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/user-balances', userBalanceRoutes);

// Sync the database and then seed the market_schedule table if necessary
sequelize.sync().then(() => {
    console.log('Database connected!');

    // Check if the table is empty
    MarketSchedule.count()
        .then(count => {
            if (count === 0) {
                // Insert default market schedule data
                MarketSchedule.bulkCreate(defaultMarketSchedule)
                    .then(() => console.log('Default market schedule initialized.'))
                    .catch(err => console.error('Error initializing market schedule:', err));
            } else {
                console.log('Market schedule already initialized.');
            }
        });
});

app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

app.listen(5000, () => console.log('Server running on port 5000'));