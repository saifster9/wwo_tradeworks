// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
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
  );
}