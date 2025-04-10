import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
  const { user } = useContext(UserContext);
  const userId    = user.userId;
  const firstName = user.firstName;

  // Cash states
  const [cashBalance, setCashBalance] = useState(0);
  const [cashAmount, setCashAmount]   = useState('');
  const [cashType, setCashType]       = useState('deposit'); // 'deposit' or 'withdraw'
  const [cashWarning, setCashWarning] = useState('');

  // Stock states
  const [stocks, setStocks]           = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [stockQty, setStockQty]       = useState('');
  const [tradeType, setTradeType]     = useState('buy');     // 'buy' or 'sell'
  const [stockWarning, setStockWarning] = useState('');

  // Holdings
  const [holdings, setHoldings]       = useState([]);

  // Fetch cash balance
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  // Fetch stocks and holdings
  const fetchStocks = useCallback(async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/stocks');
      setStocks(resp.data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }
  }, []);

  const fetchHoldings = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-holdings/${userId}`);
      setHoldings(resp.data);
    } catch (err) {
      console.error('Error fetching holdings:', err);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    if (!userId) return;
    fetchBalance();
    fetchStocks();
    fetchHoldings();
  }, [userId, fetchBalance, fetchStocks, fetchHoldings]);

  // Handle unified cash submit
  const handleCashSubmit = async e => {
    e.preventDefault();
    setCashWarning('');
    const num = parseFloat(cashAmount);
    if (isNaN(num) || num <= 0) {
      setCashWarning('Enter a positive amount.');
      return;
    }

    try {
      const amt = cashType === 'withdraw' ? -num : num;
      await axios.post('http://localhost:5000/api/cash-transactions', { userId, amount: amt });
      setCashAmount('');
      fetchBalance();
    } catch (err) {
      setCashWarning(err.response?.data?.message || 'Cash transaction failed');
    }
  };

  // Handle unified stock submit
  const handleStockSubmit = async e => {
    e.preventDefault();
    setStockWarning('');

    const qty = parseInt(stockQty, 10);
    if (!selectedStock || isNaN(qty) || qty <= 0) {
      setStockWarning('Select a stock and enter a positive quantity.');
      return;
    }

    const stock = stocks.find(s => s.id.toString() === selectedStock);
    if (!stock) {
      setStockWarning('Selected stock not found.');
      return;
    }

    const pricePerShare = parseFloat(stock.initialSharePrice);
    const totalValue = pricePerShare * qty;

    if (tradeType === 'buy' && totalValue > cashBalance) {
      setStockWarning(`Insufficient cash. Need $${totalValue.toFixed(2)}, have $${cashBalance.toFixed(2)}.`);
      return;
    }
    if (tradeType === 'buy' && qty > stock.totalSharesAvailable) {
      setStockWarning(`Only ${stock.totalSharesAvailable} shares available.`);
      return;
    }

    const endpoint = tradeType === 'buy'
      ? 'buy'
      : 'sell';

    try {
      await axios.post(`http://localhost:5000/api/stock-transactions/${endpoint}`, {
        userId,
        stockId: selectedStock,
        quantity: qty
      });
      setStockQty('');
      fetchBalance();
      fetchStocks();
      fetchHoldings();
    } catch (err) {
      setStockWarning(err.response?.data?.message || 'Stock transaction failed');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{firstName}'s Portfolio</h2>

      {/* Unified Cash Transaction */}
      <div className="admin-section">
        <h3>Cash Transaction</h3>
        <p>Balance: <strong>${cashBalance.toFixed(2)}</strong></p>
        {cashWarning && <p className="error-message">{cashWarning}</p>}

        <form onSubmit={handleCashSubmit} className="flex-form">
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={cashAmount}
            onChange={e => setCashAmount(e.target.value)}
            required
          />

          <label>
            <input
              type="radio"
              name="cashType"
              value="deposit"
              checked={cashType === 'deposit'}
              onChange={() => setCashType('deposit')}
            />
            Deposit
          </label>
          <label>
            <input
              type="radio"
              name="cashType"
              value="withdraw"
              checked={cashType === 'withdraw'}
              onChange={() => setCashType('withdraw')}
            />
            Withdraw
          </label>

          <button type="submit">
            {cashType === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </form>
      </div>

      {/* Unified Stock Transaction */}
      <div className="admin-section">
        <h3>Stock Transaction</h3>
        {stockWarning && <p className="error-message">{stockWarning}</p>}

        <form onSubmit={handleStockSubmit} className="flex-form">
          <select
            value={selectedStock}
            onChange={e => setSelectedStock(e.target.value)}
            required
          >
            <option value="">-- Select Stock --</option>
            {stocks.map(s => (
              <option key={s.id} value={s.id}>
                {s.stockTicker} ({s.companyName}) — Avail: {s.totalSharesAvailable}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            placeholder="Quantity"
            value={stockQty}
            onChange={e => setStockQty(e.target.value)}
            required
          />

          <label>
            <input
              type="radio"
              name="tradeType"
              value="buy"
              checked={tradeType === 'buy'}
              onChange={() => setTradeType('buy')}
            />
            Buy
          </label>
          <label>
            <input
              type="radio"
              name="tradeType"
              value="sell"
              checked={tradeType === 'sell'}
              onChange={() => setTradeType('sell')}
            />
            Sell
          </label>

          <button type="submit">
            {tradeType === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </form>
      </div>

      {/* User Holdings */}
      <div className="admin-section">
        <h3>Your Stock Holdings</h3>
        {holdings.length === 0 ? (
          <p>You currently own no stocks.</p>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Company</th>
                <th>Shares</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => (
                <tr key={h.id}>
                  <td>{h.stock.stockTicker}</td>
                  <td>{h.stock.companyName}</td>
                  <td>{h.shares}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Portfolio;