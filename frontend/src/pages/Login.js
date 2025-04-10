import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

function Login({ isAdmin }) {
  const [username, setUsername] = useState(localStorage.getItem('rememberUser') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');       // new

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
        isAdmin
      });

      // Persist "remember me"
      if (rememberMe) {
        localStorage.setItem('rememberUser', username);
      } else {
        localStorage.removeItem('rememberUser');
      }

      // Update global user context
      setUser({
        userId: response.data.userId,
        firstName: response.data.firstName,
        isAdmin: response.data.isAdmin
      });

      // Show success message
      setSuccess('Login successful! Redirecting...');
      
      // Wait briefly so the user sees it (optional)
      setTimeout(() => {
        navigate(isAdmin ? '/admin-dashboard' : '/user-dashboard');
      }, 1000);

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Incorrect password. Please try again.');
      } else if (err.response && err.response.status === 404) {
        setError('User not found. Please check your username.');
      } else if (err.response && err.response.status === 403) {
        setError('Unauthorized access. Admin login is for administrators only.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? <span className="spinner" />    // you can style .spinner in CSS
            : 'Login'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {isAdmin && (
        <p className="admin-login-note">
          Note: Unauthorized access attempts will be logged.
        </p>
      )}
    </div>
  );
}

export default Login;