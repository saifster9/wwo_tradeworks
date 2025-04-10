import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/new_styles.css';

function Login({ isAdmin }) {
    const [username, setUsername] = useState(localStorage.getItem('rememberUser') || '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                username,
                password,
                isAdmin: isAdmin  // Send isAdmin value to backend
            });
            alert('Login successful!');
            if (rememberMe) {
                localStorage.setItem('rememberUser', username);
            } else {
                localStorage.removeItem('rememberUser');
            }

            // Store the user' first name in localStorage
            localStorage.setItem('firstName', response.data.firstName);

            // Store the user ID in localStorage
            localStorage.setItem('userId', response.data.userId);
            
            navigate(isAdmin ? '/admin-dashboard' : '/user-dashboard');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Incorrect password. Please try again.');
            } else if (err.response && err.response.status === 404) {
                setError('User not found. Please check your username.');
            } else if (err.response && err.response.status === 403) {
                setError('Unauthorized access. Admin login is for administrators only.'); // Handle 403 error
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
                <input type="text" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div className="remember-me">
                    <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <label htmlFor="rememberMe">Remember Me</label>
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {isAdmin && <p className="admin-login-note">Note: Unauthorized access attempts will be logged.</p>}  {/* Added Admin Login message */}
        </div>
    );
}
export default Login;