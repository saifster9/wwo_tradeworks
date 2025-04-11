// src/pages/UserDashboard.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useMarketStatus from '../hooks/useMarketStatus';

function UserDashboard() {
  const navigate    = useNavigate();
  const { user }    = useContext(UserContext);
  const userId      = user.userId;
  const firstName   = user.firstName;

  // Shared market status hook
  const marketOpen  = useMarketStatus();

  // Cash balance state
  const [cashBalance, setCashBalance] = useState(0.00);

  // Fetch cash balance
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchBalance();
  }, [userId, fetchBalance]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {firstName}</h2>
      

      {/* Market Status */}
      <div className="admin-section">
      <h3>Market Status:</h3>
        <p>
          {marketOpen === null
            ? 'Loading…'
            : marketOpen
              ? 'Open for Trading'
              : 'Closed'}
        </p>
      </div>

      {/* Cash Balance Section */}
      <div className="admin-section">
        <h3>Available Cash Balance</h3>
        <p>${cashBalance.toFixed(2)}</p>
      </div>

      {/* Portfolio Section */}
      <div className="admin-section">
        <h3>Your Portfolio</h3>
        <p>You currently own no stocks.</p>
        <button
          className="admin-dashboard-button"
          onClick={() => navigate('/portfolio')}
          disabled={marketOpen === false}
        >
          Manage Portfolio
        </button>
      </div>

      {/* Transaction History Section */}
      <div className="admin-section">
        <h3>Transaction History</h3>
        <p>You have no transaction history yet.</p>
        <button
          className="admin-dashboard-button"
          onClick={() => navigate('/transaction-history')}
        >
          Transaction History
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;