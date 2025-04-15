import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import ForgotPassword from './pages/ForgotPassword.js';
import Register from './pages/Register.js';
import UserDashboard from './pages/UserDashboard.js';
import AdminDashboard from './pages/AdminDashboard.js';
import ManageStocks from './pages/ManageStocks.js';
import ManageMarket from './pages/ManageMarket.js';
import Portfolio from './pages/Portfolio.js';
import TransactionHistory from './pages/TransactionHistory.js';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized   from './pages/Unauthorized';
import { UserProvider } from './context/UserContext';

function App() {
    return (
        <UserProvider>
            <Router>
                <Navbar />
                <div id="root">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        {/* Admin only */}
                        <Route
                            path="/admin-dashboard"
                            element={
                            <ProtectedRoute requireRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                            }
                        />
                        {/* Any logged-in user */}
                        <Route
                            path="/user-dashboard"
                            element={
                            <ProtectedRoute requireRole="user">
                                <UserDashboard />
                            </ProtectedRoute>
                            }
                        />
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        {/* User routes */}
                        <Route path="/manage-stocks" element={<ManageStocks />} />
                        <Route path="/manage-market" element={<ManageMarket />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/transaction-history" element={<TransactionHistory />} />
            
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;