import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';
import Select from 'react-select';
import ConfirmModal from '../components/ConfirmModal';
import useMarketStatus from '../hooks/useMarketStatus';

function Portfolio() {
  const { user } = useContext(UserContext);
  const userId    = user.userId;
  const firstName = user.firstName;
  const marketOpen = useMarketStatus();

  // Cash states
  const [cashBalance, setCashBalance] = useState(0);
  const [cashAmount, setCashAmount]   = useState('');
  const [cashType, setCashType]       = useState('deposit'); // 'deposit' or 'withdraw'
  const [cashWarning, setCashWarning] = useState('');

  // Stock states
  const [stocks, setStocks]           = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockQty, setStockQty]       = useState('');
  const [tradeType, setTradeType]     = useState('buy');     // 'buy' or 'sell'
  const [stockWarning, setStockWarning] = useState('');

  // Holdings
  const [holdings, setHoldings]       = useState([]);

  const [pendingTrade, setPendingTrade] = useState(null);
  // { type: 'buy'|'sell', stock, qty, pricePerShare, totalCost }

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

  const handleStockSubmit = e => {
    e.preventDefault();
    setStockWarning('');
  
    // 1. Parse and validate quantity
    const qty = parseInt(stockQty, 10);
    if (!selectedStock || isNaN(qty) || qty <= 0) {
      setStockWarning('Select a stock and enter a positive quantity.');
      return;
    }
  
    // 2. Find the selected stock object
    const stockObj = stocks.find(s => s.id === selectedStock);
    if (!stockObj) {
      setStockWarning('Selected stock not found.');
      return;
    }
  
    // 3. Compute pricePerShare and totalCost
    const pricePerShare = parseFloat(stockObj.initialSharePrice);
    const totalCost     = pricePerShare * qty;
  
    // 4. Affordability and availability checks
    if (tradeType === 'buy') {
      if (totalCost > cashBalance) {
        setStockWarning(`Insufficient cash. Need $${totalCost.toFixed(2)}, have $${cashBalance.toFixed(2)}.`);
        return;
      }
      if (qty > stockObj.totalSharesAvailable) {
        setStockWarning(`Only ${stockObj.totalSharesAvailable} shares available.`);
        return;
      }
    } else {
      // you can add sell-specific checks here, e.g. holdings
    }
  
    // 5. Prepare the pendingTrade object
    setPendingTrade({
      type: tradeType,
      ticker: stockObj.stockTicker,
      company: stockObj.companyName,
      qty,
      pricePerShare,
      totalCost
    });
  };

  const confirmTrade = async () => {
    const { type, qty } = pendingTrade;
    try {
      await axios.post(
        `http://localhost:5000/api/stock-transactions/${type}`,
        { userId, stockId: selectedStock, quantity: qty }
      );
      fetchBalance();
      fetchStocks();
      fetchHoldings();
    } catch (err) {
      setStockWarning(err.response?.data?.message || 'Transaction failed');
    } finally {
      setPendingTrade(null);
      setStockQty('');
    }
  };

  const cancelTrade = () => setPendingTrade(null);

  const stockOptions = stocks.map(s => ({
    value: s.id,
    label: `${s.stockTicker} - ${s.companyName} (Avail: ${s.totalSharesAvailable})`
  }));

  return (
    <div className="dashboard-container">
      <h2>{firstName}'s Portfolio</h2>

      {/* Market Status */}
      <div className="admin-section">
        <h3>Market Status</h3>
        <p>
          {marketOpen === null
            ? 'Loading...'
            : marketOpen
              ? 'The market is open.'
              : 'The market is closed.'}
        </p>
      </div>

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

      {/* Stock Transaction */}
      <div className="admin-section">
        <h3>Stock Transaction</h3>
        {stockWarning && <p className="error-message">{stockWarning}</p>}

        <form onSubmit={handleStockSubmit} className="flex-form">
          <Select
            options={stockOptions}
            value={stockOptions.find(o => o.value === selectedStock) || null}
            onChange={opt => setSelectedStock(opt ? opt.value : '')}  // opt.value is a number
            placeholder="Select a stock..."
            isSearchable
            styles={{
              container: prov => ({ ...prov, flex: 1, minWidth: 200 }),
              control: prov => ({ ...prov, borderRadius: 'var(--border-radius)' })
            }}
          />

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

          <button type="submit" disabled={marketOpen === false}>
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
      
      {/* Confirmation Modal */}
    <ConfirmModal
      isOpen={!!pendingTrade}
      onCancel={cancelTrade}
      onConfirm={confirmTrade}
      details={pendingTrade || {}}
    />
    </div>
  );
}

export default Portfolio;