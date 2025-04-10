import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userId = user.userId;
  const firstName = user.firstName;

  // Local state for cash balance
  const [cashBalance, setCashBalance] = useState(0.00);

  // Fetch cash balance (wrapped in useCallback so effect deps are stable)
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  // When userId becomes available, fetch balance
  useEffect(() => {
    if (!userId) return;
    fetchBalance();
  }, [userId, fetchBalance]);

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {firstName}</h2>

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
