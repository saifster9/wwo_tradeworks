import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useMarketStatus from '../hooks/useMarketStatus';

function AdminDashboard() {
    const [stocks, setStocks] = useState([]);
    const [marketSchedule, setMarketSchedule] = useState([]);
    const navigate = useNavigate();
    const marketOpen = useMarketStatus();

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stocks');
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        };

        const fetchMarketSchedule = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/market/schedule');
                setMarketSchedule(response.data);
            } catch (error) {
                console.error('Error fetching market schedule:', error);
            }
        };

        fetchStocks();
        fetchMarketSchedule();
    }, []);

    const getDayName = (dayOfWeek) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    };

    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>

            {/* Display Stocks */}
            <div className="admin-section">
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
            
            {/* Display Market Schedule */}
            <div className="admin-section">
                <h3>Market Schedule</h3>
                <h4>Market Status:</h4>
                <p>
                    {marketOpen === null
                        ? 'Loading…'
                        : marketOpen
                            ? 'Open'
                            : 'Closed'}
                </p>
                <p>Current Trading Days and Hours:</p>
                {marketSchedule.length > 0 ? (
                    <ul>
                        {marketSchedule.map(day => (
                            <li key={day.day_of_week}>
                                {getDayName(day.day_of_week)}: {day.open_time ? day.open_time.substring(0, 5) : '00:00'} - {day.close_time ? day.close_time.substring(0, 5) : '00:00'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Market schedule not set.</p>
                )}
                <button onClick={() => navigate('/manage-market')}>Manage Market</button>
            </div>
        </div>
    );
}

export default AdminDashboard;
