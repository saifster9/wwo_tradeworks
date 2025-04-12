import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/new_styles.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="home-container">
        <h1>Welcome to WWO Tradeworks</h1>
        <div className="home-actions">
          <button
            className="primary-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <p>Log in to your account to view stocks, manage your cash balance, and make trades.</p>
        </div>
        <div className="home-actions">
          <button
            className="primary-button"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
          <p>New to WWO Tradeworks? Create an account to start trading today!</p>
        </div>
      </div>
    </div>
  );
}