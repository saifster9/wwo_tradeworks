// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useContext(UserContext) || {};

  // If context isn't ready yet, you could show a loading spinner
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user.userId) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}