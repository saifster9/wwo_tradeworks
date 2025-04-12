// src/components/PriceTicker.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PriceTicker.css'; // You can style as you like

export default function PriceTicker({ refreshInterval = 60_000 }) {
  const [stocks, setStocks] = useState([]);
  const [error, setError]   = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchStocks = async () => {
      try {
        const resp = await axios.get('http://localhost:5000/api/stocks');
        if (isMounted) {
          setStocks(resp.data);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching stocks for ticker:', err);
        if (isMounted) setError('Unable to load prices');
      }
    };

    // Initial load
    fetchStocks();

    // Poll every refreshInterval ms
    const id = setInterval(fetchStocks, refreshInterval);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [refreshInterval]);

  if (error) {
    return <div className="price-ticker error">{error}</div>;
  }

  return (
    <div className="price-ticker">
      {stocks.map(stock => (
        <div key={stock.id} className="ticker-item">
          <span className="ticker-symbol">{stock.stockTicker}</span>
          <span className="ticker-price">${parseFloat(stock.initialSharePrice).toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}