import { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

export default function useMarketStatus() {
  const [isOpen, setIsOpen] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const resp = await apiClient.get('/api/market/market-open');
        setIsOpen(resp.data.open);
      } catch (err) {
        console.error('Error fetching market status:', err);
        setIsOpen(false); // Default to closed on error? Or maybe null?
      }
    };

    fetchStatus();
    const iv = setInterval(fetchStatus, 60_000); // Poll every minute
    return () => clearInterval(iv);
  }, []); // Empty dependency array means run once on mount, plus cleanup

  return isOpen;
}