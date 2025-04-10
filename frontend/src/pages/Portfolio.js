import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
  const [cashBalance, setCashBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [warning, setWarning] = useState('');

  const { user } = useContext(UserContext);
  const userId = user.userId;
  const firstName = user.firstName;

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

  const handleSubmit = async e => {
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
      console.error(err);
      if (err.response && err.response.status === 400) {
        setWarning(err.response.data.message);
      } else {
        setWarning('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{firstName}'s Portfolio</h2>

      {/* Cash Balance and Actions */}
      <div className="admin-section">
        <h3>Cash Balance</h3>
        <p>${cashBalance.toFixed(2)}</p>
        <h4>Deposit / Withdraw Cash</h4>
        {warning && (
          <p className="error-message" style={{ color: 'red' }}>
            {warning}
          </p>
        )}
        <form onSubmit={handleSubmit}>
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

      {/* Stock Section */}
      <div className="admin-section">
        {/* Your stock holdings will go here */}
      </div>
    </div>
  );
}

export default Portfolio;