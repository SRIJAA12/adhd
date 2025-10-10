import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
