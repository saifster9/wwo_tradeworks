import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useMarketStatus() {
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const resp = await axios.get('http://localhost:5000/api/market/market-open');
        setIsOpen(resp.data.open);      // ← must match the `open` field
      } catch (err) {
        console.error('Error fetching market status:', err);
        setIsOpen(false);
      }
    };

    fetchStatus();
    const iv = setInterval(fetchStatus, 60_000);
    return () => clearInterval(iv);
  }, []);

  return isOpen;
}