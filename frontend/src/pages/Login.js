import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/new_styles.css';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const [username, setUsername]     = useState(localStorage.getItem('rememberUser') || '');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { username, password }
      );

      // Remember me
      if (rememberMe) {
        localStorage.setItem('rememberUser', username);
      } else {
        localStorage.removeItem('rememberUser');
      }

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
      if (err.response?.status === 401) {
        setError('Incorrect password. Please try again.');
      } else if (err.response?.status === 403) {
        setError('Unauthorized access.');
      } else {
        setError('An error occurred. Please try again later.');
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

        {/* Remember Me */}
        <div className="remember-me">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

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