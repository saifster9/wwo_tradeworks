// src/pages/Login.js
import React, { useState, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import fullLogo from '../assets/logo-full.png';
import '../styles/new_styles.css';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername]     = useState(localStorage.getItem('rememberUser') || '');
  const [password, setPassword]     = useState('');
  // State for "Remember Me" checkbox - already existed
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberUser')); // Initialize based on localStorage
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState('');

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await apiClient.post(
        '/api/users/login', // Use relative path
        { username, password }
      );

      // Remember me logic - already existed
      if (rememberMe) {
        localStorage.setItem('rememberUser', username);
      } else {
        localStorage.removeItem('rememberUser');
      }

      // Persist user info - already existed
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('firstName', data.firstName);
      localStorage.setItem('role', data.isAdmin ? 'admin' : 'user');

      setUser({
        userId: data.userId,
        firstName: data.firstName,
        role: data.isAdmin ? 'admin' : 'user'
      });

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate(data.isAdmin ? '/admin-dashboard' : '/user-dashboard');
      }, 1000);

    } catch (err) {
      // Keep your existing detailed error handling
      console.error('Login error response:', err.response || err);
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          setError('Incorrect username or password. Please try again.'); // Combined message
        } else if (status === 403) {
          setError('Unauthorized access. Admin login is for administrators only.');
        } else if (status === 404) { // Should ideally not happen if 401 covers wrong user/pass
          setError('User not found. Please check your username.');
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError(`Login failed (${status}). Please try again.`);
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <img src={fullLogo} alt="WWO Tradeworks Logo" style={{ maxWidth: '250px', marginBottom: '20px', display: 'block', margin: 'auto' }} />

      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: '350px', margin: '0 auto' }}>
        {/* Username Input */}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        {/* Password Input */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Forgot Password Row */}
        <div className="forgot-password-row">

          {/* Forgot Password Link (Placeholder) */}
          <div>
            <Link to="/forgot-password">Forgot Password?</Link>
            {/* Note: The /forgot-password route and functionality need to be implemented separately */}
          </div>
        </div>

        {/* Submit Button */}
        {/* Make button full width within the constrained form */}
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Login'}
        </button>

         {/* Error Message Display Area */}
         {error && (
            <p className="error-message">{error}</p>
         )}

         {/* Success Message Display Area */}
         {success && <p className="success-message">{success}</p>}
      </form>

      {/* --- NEW: Link to Register Page --- */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

    </div>
  );
}