import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/axiosConfig'; 
import '../styles/PriceTicker.css';

export default function PriceTicker({ refreshInterval = 60000 }) {
  const [stocks, setStocks] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStocks = async () => {
      try {
        const resp = await apiClient.get('/api/stocks');
        if (isMounted) setStocks(resp.data);
      } catch (err) {
        console.error('Error fetching stocks for ticker:', err);
      }
    };

    fetchStocks();
    const id = setInterval(fetchStocks, refreshInterval);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [refreshInterval]);

  // Duplicate the list to make the loop seamless
  const displayList = [...stocks, ...stocks];

  return (
    <div className="price-ticker">
      <div className="ticker-track" ref={containerRef}>
        {displayList.map((stock, idx) => (
          <div key={`${stock.id}-${idx}`} className="ticker-item">
            <span className="ticker-symbol">{stock.stockTicker}</span>
            <span className="ticker-price">
              ${parseFloat(stock.initialSharePrice).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}