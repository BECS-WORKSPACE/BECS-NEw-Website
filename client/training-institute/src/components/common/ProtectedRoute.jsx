import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role && user.role.name) || user.legacyRole || (user.isAdmin ? 'admin' : 'student');
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && !allowedRoles.includes(userRole.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
