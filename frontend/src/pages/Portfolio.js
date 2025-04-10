import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
    const [cashBalance, setCashBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [txHistory, setTxHistory] = useState([]);
    const { user } = useContext(UserContext);
    const userId = user.userId;
    const firstName = user.firstName;    
    
    useEffect(() => {
      // fetch balance & history
      fetchBalance();
      fetchHistory();
    }, [userId]);
  
    const fetchBalance = async () => {
      const resp = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
      setCashBalance(parseFloat(resp.data.cash_balance));
    };
  
    const fetchHistory = async () => {
      const resp = await axios.get(`http://localhost:5000/api/cash-transactions/${userId}`);
      setTxHistory(resp.data);
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      const num = parseFloat(amount);
      if (isNaN(num) || num === 0) return alert('Enter a non‑zero number');
      try {
        await axios.post('http://localhost:5000/api/cash-transactions', { userId, amount: num });
        setAmount('');
        fetchBalance();
        fetchHistory();
      } catch (err) {
        console.error(err);
        alert('Transaction failed');
      }
    };
  
    return (
      <div className="dashboard-container">
        <h2>{firstName}'s Portfolio</h2>
  
        {/* Cash Balance Section */}
        <div className="admin-section">
          <h3>Cash Balance</h3>
          <p>${cashBalance.toFixed(2)}</p>

          {/* Deposit/Withdraw Section */}
          <h5>Deposit / Withdraw Cash</h5>
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

        
        <div className="admin-section">
        <h3>Stock Trade</h3>
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