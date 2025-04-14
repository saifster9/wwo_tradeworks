import React, { useState, useContext } from 'react';
import apiClient from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles/new_styles.css';
import '../styles/Login.css';

export default function Login() {
  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
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
        '/api/users/login',
        { username, password }
      );

      // Persist user info
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
      console.error('Login error response:', err.response || err);
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          setError('Incorrect password. Please try again.');
        } else if (status === 403) {
          setError('Unauthorized access. Admin login is for administrators only.');
        } else if (status === 404) {
          setError('User not found. Please check your username.');
        } else if (data && data.message) {
          // Use server’s message if present
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        {/* Password */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : 'Login'}
        </button>
      </form>

      {/* Feedback */}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}