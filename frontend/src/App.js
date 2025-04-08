import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import UserDashboard from './pages/UserDashboard.js';
import AdminDashboard from './pages/AdminDashboard.js';
import ManageStocks from './pages/ManageStocks.js';
import ManageMarket from './pages/ManageMarket.js';
import Portfolio from './pages/Portfolio.js';
import TransactionHistory from './pages/TransactionHistory.js';
import React from 'react';

function App() {
    return (
        <Router>
            <Navbar />
            <div id="root">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login isAdmin={false} />} />
                    <Route path="/admin" element={<Login isAdmin={true} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/manage-stocks" element={<ManageStocks />} />
                    <Route path="/manage-market" element={<ManageMarket />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/transaction-history" element={<TransactionHistory />} />
                
                </Routes>
            </div>
        </Router>
    );
}

export default App;