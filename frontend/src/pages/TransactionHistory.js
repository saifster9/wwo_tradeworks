import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import '../styles/TransactionHistory.css';
import { UserContext } from '../context/UserContext';

function TransactionHistory() {
  const { user } = useContext(UserContext);
  const userId = user.userId;

  const [cashTx, setCashTx]   = useState([]);
  const [stockTx, setStockTx] = useState([]);

  // Fetch cash history
  const fetchCash = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/cash-transactions/${userId}`);
      setCashTx(resp.data);
    } catch (err) {
      console.error('Error fetching cash history:', err);
    }
  }, [userId]);

  // Fetch stock history
  const fetchStock = useCallback(async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/stock-transactions/history/${userId}`);
      setStockTx(resp.data);
    } catch (err) {
      console.error('Error fetching stock history:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchCash();
    fetchStock();
  }, [userId, fetchCash, fetchStock]);

  return (
    <div className="dashboard-container">
      <h2>Transaction History</h2>

      <div className="transaction-history-card">
        {/* Cash Transactions */}
        <div className="dashboard-style">
          <h3>Cash Transactions</h3>
          {cashTx.length === 0 ? (
            <p>No cash transactions yet.</p>
          ) : (
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Date</th><th>Type</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {cashTx.map(tx => (
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

      <div className="transaction-history-card">
        {/* Stock Transactions */}
        <div className="dashboard-style">
          <h3>Stock Transactions</h3>
          {stockTx.length === 0 ? (
            <p>No stock transactions yet.</p>
          ) : (
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Price/Share</th>
                </tr>
              </thead>
              <tbody>
                {stockTx.map(tx => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>{tx.transactionType}</td>
                    <td>{tx.Stock?.stockTicker || '—'}</td>
                    <td>{tx.quantity}</td>
                    <td>${parseFloat(tx.pricePerShare).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;