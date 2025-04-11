import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useMarketStatus(pollInterval = 60000) {
  const [marketOpen, setMarketOpen] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMarketStatus = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/market/market-open');
        if (isMounted) setMarketOpen(data.isOpen);
      } catch (err) {
        console.error('Error fetching market status:', err);
        if (isMounted) setMarketOpen(false);
      }
    };

    fetchMarketStatus();
    const id = setInterval(fetchMarketStatus, pollInterval);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [pollInterval]);

  return marketOpen;
}