// src/pages/UserDashboard.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useMarketStatus from '../hooks/useMarketStatus';
import '../styles/new_styles.css';
import '../styles/UserDashboard.css';

function formatDateDDMMYY(isoString) {
  const d = new Date(isoString);
  const day   = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year  = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function UserDashboard() {
  const navigate    = useNavigate();
  const { user }    = useContext(UserContext);
  const userId      = user.userId;
  const firstName   = user.firstName;

  const marketOpen  = useMarketStatus();

  // Cash balance state
  const [cashBalance, setCashBalance] = useState(0.00);

  // Holdings and recent stock tx
  const [holdings, setHoldings]       = useState([]);
  const [recentTx, setRecentTx]       = useState([]);

  // Fetch cash balance
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  // Fetch holdings
  const fetchHoldings = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-holdings/${userId}`);
      setHoldings(resp.data);
    } catch (err) {
      console.error('Error fetching holdings:', err);
    }
  }, [userId]);

  // Fetch recent stock transactions
  const fetchRecentStockTx = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/stock-transactions/history/${userId}`);
      setRecentTx(resp.data.slice(0, 5)); // take last 5
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
    }
  }, [userId]);

  // On mount
  useEffect(() => {
    if (!userId) return;
    fetchBalance();
    fetchHoldings();
    fetchRecentStockTx();
  }, [userId, fetchBalance, fetchHoldings, fetchRecentStockTx]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {firstName}</h2>

      <div className="dashboard-grid">
        {/* Market Status */}
        <div className="card">
          <div className="dashboard-style">
            <h3>Market Status:</h3>
            <p>
              {marketOpen === null
                ? 'Loading…'
                : marketOpen
                  ? 'Open for Trading'
                  : 'Closed'}
            </p>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="card">
          <div className="dashboard-style">
            <h3>Available Cash Balance</h3>
            <p>${cashBalance.toFixed(2)}</p>
          </div>
        </div>

        {/* Portfolio */}
        <div className="card">
          <div className="dashboard-style">
            <h3>Your Portfolio</h3>
            {holdings.length > 0 ? (
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
            ) : (
              <p>You currently own no stocks.</p>
            )}
            <button
              className="admin-dashboard-button"
              onClick={() => navigate('/portfolio')}
            >
              Manage Portfolio
            </button>
          </div>
        </div>

        {/* Recent Stock Transactions */}
        <div className="card">
          <div className="dashboard-style">
            <h3>Recent Stock Transactions</h3>
            {recentTx.length > 0 ? (
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Ticker</th>
                    <th>Quantity</th>
                    <th>Price/Share</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map(tx => (
                    <tr key={tx.id}>
                      <td>{formatDateDDMMYY(tx.createdAt).toLocaleString()}</td>
                      <td>{tx.transactionType}</td>
                      <td>{tx.Stock.stockTicker}</td>
                      <td>{tx.quantity}</td>
                      <td>${parseFloat(tx.pricePerShare).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <>
                <p>You have no recent stock transactions.</p>
                <button
                  className="admin-dashboard-button"
                  onClick={() => navigate('/transaction-history')}
                >
                  View All Transactions
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;