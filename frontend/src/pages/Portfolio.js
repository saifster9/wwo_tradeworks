import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
  const { user } = useContext(UserContext);
  const userId    = user.userId;
  const firstName = user.firstName;

  // State
  const [cashBalance, setCashBalance]       = useState(0);
  const [amount, setAmount]                 = useState('');
  const [warning, setWarning]               = useState('');

  const [stocks, setStocks]                 = useState([]);
  const [selectedStock, setSelectedStock]   = useState('');
  const [stockQty, setStockQty]             = useState('');
  const [stockWarning, setStockWarning]     = useState('');

  const [holdings, setHoldings]             = useState([]);

  // Fetch cash balance
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  // Fetch available stocks
  const fetchStocks = useCallback(async () => {
    try {
      const resp = await axios.get('http://localhost:5000/api/stocks');
      setStocks(resp.data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
    }
  }, []);

  // Fetch user holdings
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
      setWarning(
        err.response?.status === 400
          ? err.response.data.message
          : 'An unexpected error occurred.'
      );
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
  
    // 1) Find the selected stock object
    const stock = stocks.find(s => s.id.toString() === selectedStock);
    if (!stock) {
      setStockWarning('Selected stock not found.');
      return;
    }
  
    // 2) Compute total cost
    const pricePerShare = parseFloat(stock.initialSharePrice);
    const totalCost = pricePerShare * qty;
  
    // 3) Check cash balance
    if (totalCost > cashBalance) {
      setStockWarning(`Insufficient cash. You need $${totalCost.toFixed(2)}, but have only $${cashBalance.toFixed(2)}.`);
      return;
    }
  
    // 4) Check availability
    if (qty > stock.totalSharesAvailable) {
      setStockWarning(`Only ${stock.totalSharesAvailable} shares available.`);
      return;
    }
  
    // 5) Proceed with buy request
    try {
      await axios.post('http://localhost:5000/api/stock-transactions/buy', {
        userId,
        stockId: selectedStock,
        quantity: qty
      });
      // Clear input
      setStockQty('');
      // Refresh data
      fetchBalance();
      fetchStocks();
      fetchHoldings();
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
      setStockQty('');
      fetchBalance();
      fetchStocks();
      fetchHoldings();
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
        <p className="large-text">${cashBalance.toFixed(2)}</p>

        <h4>Deposit / Withdraw Cash</h4>
        {warning && <p className="error-message">{warning}</p>}
        <form onSubmit={handleSubmitCash} className="flex-form">
          <input
            type="number"
            step="0.01"
            placeholder="+ deposit, – withdraw"
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

        {stockWarning && <p className="error-message">{stockWarning}</p>}

        <div className="flex-form">
          <select
            value={selectedStock}
            onChange={e => setSelectedStock(e.target.value)}
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
          />

          <button onClick={handleBuy}>Buy</button>
          <button onClick={handleSell}>Sell</button>
        </div>
      </div>

      {/* User Holdings */}
      <div className="admin-section">
        <h3>Your Stock Holdings</h3>

        {holdings.length === 0 ? (
          // Only displayed if the user has no stocks
          // This is a placeholder for the case when the user has no stocks
          <p>You currently own no stocks.</p>
        ) : (
          // Display the user's stock holdings in a table format
          // This is a placeholder for the case when the user has stocks
          <table className="stock-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Company</th>
                <th>Shares Owned</th>
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