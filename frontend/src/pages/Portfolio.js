import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [cashBalance, setCashBalance] = useState(0.00);

    // Access global user data
    const { user } = useContext(UserContext);
    const firstName = user.firstName;
    const userId = user.userId;
    
    
    useEffect(() => {
        const fetchPortfolioData = async () => {
          try {
            if (!userId) {
              console.error('User ID is not available in the global state.');
              return;
            }
            const cashBalanceResponse = await axios.get(`http://localhost:5000/api/user-balances/${userId}`);
            // Ensure conversion to number if necessary
            const fetchedBalance = parseFloat(cashBalanceResponse.data.cash_balance);
            setCashBalance(fetchedBalance);
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
            <h2>{firstName}'s Portfolio</h2>

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