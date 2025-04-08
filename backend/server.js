const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db.config');
const userRoutes = require('./routes/user.routes');
const stockRoutes = require('./routes/stock.routes');
const marketRoutes = require('./routes/market.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/market', marketRoutes);


sequelize.sync().then(() => console.log('Database connected!'));

app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

app.listen(5000, () => console.log('Server running on port 5000'));