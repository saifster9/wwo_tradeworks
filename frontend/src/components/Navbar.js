import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/new_styles.css';
import React from 'react';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Use useLocation to get the current path

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('rememberUser');
        localStorage.removeItem('firstName');
        navigate('/');
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {/* Conditionally render links based on the route */}
            {location.pathname === '/user-dashboard' || location.pathname === '/portfolio' || location.pathname === '/transaction-history' ? (
                <>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/transaction-history">Transaction History</Link>
                    <Link to="/login" onClick={handleLogout} className="logout-button">
                        Logout
                    </Link>
                </>
            ) : location.pathname === '/admin-dashboard' || location.pathname === '/manage-stocks' || location.pathname === '/market-settings' ? (
                <>
                    <Link to="/admin-dashboard">Home</Link>
                    <Link to="/manage-stocks">Manage Stocks</Link>
                    <Link to="/market-settings">Manage Market</Link>
                    <Link to="/" onClick={handleLogout} className="logout-button">
                        Logout
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login">User Login</Link>
                    <Link to="/admin">Admin Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;