import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/new_styles.css';

function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [cashBalance, setCashBalance] = useState(0.00);
    const { userId } = localStorage.getItem('userId');;

    useEffect(() => {
    const fetchPortfolioData = async () => {
        try {
            // Fetch cash balance
            const cashBalanceResponse = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
            setCashBalance(cashBalanceResponse.data.cashBalance);

        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data.');
        }
    };

    fetchPortfolioData();
}, [userId]);

return (
    <div>
        <div className="dashboard-container">
            <h2>Your Portfolio</h2>

            {/* Cash Balance Section */}
            <div className="admin-section">
                <h3>Cash Balance</h3>
                <p>Available for Trading: ${cashBalance.toFixed(2)}</p>
            </div>

            {/* Portfolio Section */}
            <div className="admin-section">
                <h3>Your Stock Holdings</h3>
                {/* ... (Your stock holdings display code here - if any) ... */}
            </div>
        </div>
    </div>
);

}

export default Portfolio;