import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function TransactionHistory() {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [txHistory, setTxHistory] = useState([]);

  // Fetch transaction history
  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const resp = await axios.get(`http://localhost:5000/api/cash-transactions/${userId}`);
      setTxHistory(resp.data);
    } catch (err) {
      console.error('Error fetching transaction history:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="dashboard-container">
      <h2>Transaction History</h2>

      {txHistory.length === 0 ? (
        <p>No cash transactions yet.</p>
      ) : (
        <table className="stock-table">
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
  );
}

export default TransactionHistory;