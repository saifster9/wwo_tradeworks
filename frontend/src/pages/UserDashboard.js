import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const firstName = user.firstName;
  const userId    = user.userId;

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {firstName}</h2>

      {/* Portfolio Section */}
      <div className="admin-section">
        <h3>Your Portfolio</h3>
        <p>You currently own no stocks.</p>
        <button
          className="admin-dashboard-button"
          onClick={() => navigate('/portfolio')}
        >
          Manage Portfolio
        </button>
      </div>

      {/* Transaction History Section */}
      <div className="admin-section">
        <h3>Transaction History</h3>
        <p>You have no transaction history yet.</p>
        <button
          className="admin-dashboard-button"
          onClick={() => navigate('/transaction-history')}
        >
          Transaction History
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
