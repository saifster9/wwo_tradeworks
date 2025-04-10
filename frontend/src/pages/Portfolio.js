import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
  const [cashBalance, setCashBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [txHistory, setTxHistory] = useState([]);
  const [warning, setWarning] = useState('');            // 1) warning state

  const { user } = useContext(UserContext);
  const userId = user.userId;
  const firstName = user.firstName;

  // Only define fetch functions if userId exists
  const fetchBalance = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }, [userId]);

  const fetchHistory = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/cash-transactions/${userId}`);
      setTxHistory(resp.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;   // <<--- Guard here
    fetchBalance();
    fetchHistory();
  }, [userId, fetchBalance, fetchHistory]);

  const handleSubmit = async e => {
    e.preventDefault();
    setWarning('');  // clear previous warning
    const num = parseFloat(amount);
    if (isNaN(num) || num === 0) {
      setWarning('Please enter a non‑zero numeric amount.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cash-transactions', { userId, amount: num });
      setAmount('');
      fetchBalance();
      fetchHistory();
    } catch (err) {
      console.error(err);
      // 2) inspect error
      if (err.response && err.response.status === 400) {
        // use the backend message if provided
        const msg = err.response.data.message || 
                    'Warning: The withdrawal amount cannot exceed available cash balance.';
        setWarning(msg);
      } else {
        setWarning('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>{firstName}'s Portfolio</h2>

      {/* Deposit/Withdraw Section */}
      <div className="admin-section">
        <h3>Deposit / Withdraw Cash</h3>
        {warning && (                                      // 3) render warning
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

      {/* Cash Balance Section */}
      <div className="admin-section">
        <h3>Cash Balance</h3>
        <p>${cashBalance.toFixed(2)}</p>
      </div>

      {/* Transaction History */}
      <div className="admin-section">
        <h3>Cash Transaction History</h3>
        {txHistory.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {txHistory.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td>{tx.transactionType}</td>
                  <td>${parseFloat(tx.amount).toFixed(2)}</td>
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
