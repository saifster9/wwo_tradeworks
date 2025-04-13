import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import useMarketStatus from '../hooks/useMarketStatus';
import WeeklySchedule from '../components/WeeklySchedule';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [stocks, setStocks] = useState([]);
  const [marketSchedule, setMarketSchedule] = useState([]);
  const navigate = useNavigate();
  const marketOpen = useMarketStatus();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await apiClient.get('/api/stocks');
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };

    const fetchMarketSchedule = async () => {
      try {
        const response = await apiClient.get('/api/market/schedule');
        setMarketSchedule(response.data);
      } catch (error) {
        console.error('Error fetching market schedule:', error);
      }
    };

    fetchStocks();
    fetchMarketSchedule();
  }, []);

  const getDayName = dayOfWeek => {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[dayOfWeek];
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-grid">

        <div className="card">
          {/* Display Stocks */}
          <div className="dashboard-style">
            <h3>Existing Stocks</h3>
            {stocks.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Stock Ticker</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(stock => (
                    <tr key={stock.id}>
                      <td>{stock.companyName}</td>
                      <td>{stock.stockTicker}</td>
                      <td>{stock.initialSharePrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No stocks available.</p>
            )}
            <button onClick={() => navigate('/manage-stocks')}>Manage Stocks</button>
          </div>
        </div>

        <div className="card">
          {/* Market Status */}
          <div className="dashboard-style">
            <h3>Market Status</h3>
            <p>
              {marketOpen === null
                ? 'Loading…'
                : marketOpen
                  ? 'Open'
                  : 'Closed'}
            </p>
          </div>
        </div>

        <div className="card">
          {/* Calendar‑style Weekly View */}
          <div className="dashboard-style">
            <h3>Weekly Market Schedule</h3>
            <WeeklySchedule schedule={marketSchedule} />
          </div>
        </div>

        <div className="card">
          {/* Fallback List View */}
          <div className="dashboard-style">
            <h3>Current Trading Days and Hours</h3>
            {marketSchedule.length > 0 ? (
              (() => {
                // Filter only trading days
                const tradingDays = marketSchedule.filter(day => day.isTradingDay);
                return tradingDays.length > 0 ? (
                  <ul>
                    {tradingDays.map(day => (
                      <li key={day.day_of_week}>
                        {getDayName(day.day_of_week)}:{' '}
                        {day.open_time?.substring(0,5) || '00:00'} –{' '}
                        {day.close_time?.substring(0,5) || '00:00'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No trading days are currently enabled.</p>
                );
              })()
            ) : (
              <p>No market schedule available.</p>
            )}
            <button onClick={() => navigate('/manage-market')}>
              Manage Market
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;