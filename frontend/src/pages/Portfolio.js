import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const firstName = user.firstName;

  const [cashBalance, setCashBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [warning, setWarning] = useState('');

  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockWarning, setStockWarning] = useState('');

  // Fetch cash balance
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  // Fetch stock listings
  const fetchStocks = useCallback(async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/stocks');
      setStocks(resp.data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!userId) return;
    fetchBalance();
    fetchStocks();
  }, [userId, fetchBalance, fetchStocks]);

  // Handle cash deposit/withdraw
  const handleSubmitCash = async e => {
    e.preventDefault();
    setWarning('');
    const num = parseFloat(amount);
    if (isNaN(num) || num === 0) {
      setWarning('Please enter a non‑zero numeric amount.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/cash-transactions', { userId, amount: num });
      setAmount('');
      fetchBalance();
    } catch (err) {
      if (err.response?.status === 400) setWarning(err.response.data.message);
      else setWarning('An unexpected error occurred.');
    }
  };

  // Handle stock buy
  const handleBuy = async () => {
    setStockWarning('');
    const qty = parseInt(stockQty, 10);
    if (!selectedStock || isNaN(qty) || qty <= 0) {
      setStockWarning('Select a stock and enter a positive quantity.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/stock-transactions/buy', {
        userId,
        stockId: selectedStock,
        quantity: qty
      });
      fetchBalance();
      fetchStocks();
      setStockQty('');
    } catch (err) {
      setStockWarning(err.response?.data?.message || 'Buy failed');
    }
  };

  // Handle stock sell
  const handleSell = async () => {
    setStockWarning('');
    const qty = parseInt(stockQty, 10);
    if (!selectedStock || isNaN(qty) || qty <= 0) {
      setStockWarning('Select a stock and enter a positive quantity.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/stock-transactions/sell', {
        userId,
        stockId: selectedStock,
        quantity: qty
      });
      fetchBalance();
      fetchStocks();
      setStockQty('');
    } catch (err) {
      setStockWarning(err.response?.data?.message || 'Sell failed');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{firstName}'s Portfolio</h2>

      {/* Cash Balance & Actions */}
      <div className="admin-section">
        <h3>Cash Balance</h3>
        <p>${cashBalance.toFixed(2)}</p>
        <h4>Deposit / Withdraw Cash</h4>
        {warning && <p className="error-message" style={{ color: 'red' }}>{warning}</p>}
        <form onSubmit={handleSubmitCash}>
          <input
            type="number"
            step="0.01"
            placeholder="Positive to deposit, negative to withdraw"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Buy / Sell Stocks */}
      <div className="admin-section">
        <h3>Buy / Sell Stocks</h3>
        {stockWarning && <p style={{ color: 'red' }}>{stockWarning}</p>}
        <select value={selectedStock} onChange={e => setSelectedStock(e.target.value)}>
          <option value="">-- Select Stock --</option>
          {stocks.map(s => (
            <option key={s.id} value={s.id}>
              {s.stockTicker} ({s.companyName}) – Available: {s.totalSharesAvailable}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={stockQty}
          onChange={e => setStockQty(e.target.value)}
        />
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>
    </div>
  );
}

export default Portfolio;