const express   = require('express');
const cors      = require('cors');
const sequelize = require('./config/db.config');

// Import routes
const userRoutes         = require('./routes/user.routes');
const stockRoutes        = require('./routes/stock.routes');
const marketRoutes       = require('./routes/market.routes');
const userBalanceRoutes  = require('./routes/userBalance.routes');
const cashTxRoutes       = require('./routes/cashTransaction.routes');
const stockTxRoutes      = require('./routes/stockTransaction.routes');
const userHoldingRoutes  = require('./routes/userHolding.routes');

// Import models from the index (factory‑initialized)
const { Stock, MarketSchedule } = require('./models');
const defaultMarketSchedule      = require('./data/defaultMarketSchedule');

// Market‑status helper
const { isMarketOpenInternal } = require('./utils/marketStatus');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount your API routes
app.use('/api/users',          userRoutes);
app.use('/api/stocks',         stockRoutes);
app.use('/api/market',         marketRoutes);
app.use('/api/user-balances',  userBalanceRoutes);
app.use('/api/cash-transactions', cashTxRoutes);
app.use('/api/stock-transactions', stockTxRoutes);
app.use('/api/user-holdings',  userHoldingRoutes);

// Sync the database, start the ticker, and seed the schedule
sequelize.sync()
  .then(() => {
    console.log('Database connected!');

    // 1. Start the price ticker
    const TICK_INTERVAL_MS = 60 * 1000;
    setInterval(async () => {
      try {
        if (!(await isMarketOpenInternal())) return;

        const allStocks = await Stock.findAll();
        for (const stock of allStocks) {
          const oldPrice  = parseFloat(stock.initialSharePrice);
          const pctChange = (Math.random() * 2 - 1) * 0.005; // ±0.5%
          const newPrice  = +(oldPrice * (1 + pctChange)).toFixed(2);
          await stock.update({ initialSharePrice: newPrice });
        }
        console.log('Prices ticked at', new Date().toISOString());
      } catch (err) {
        console.error('Error in price ticker:', err);
      }
    }, TICK_INTERVAL_MS);

    // 2. Seed market schedule if empty
    return MarketSchedule.count();
  })
  .then(count => {
    if (count === 0) {
      return MarketSchedule.bulkCreate(defaultMarketSchedule)
        .then(() => console.log('Default market schedule initialized.'));
    } else {
      console.log('Market schedule already initialized.');
    }
  })
  .catch(err => {
    console.error('Unable to connect to database or seed data:', err);
    process.exit(1);
  });

// Health check
app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

const PORT = process.env.PORT || 5000; // Use Azure's port or fallback to 5000 locally
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));