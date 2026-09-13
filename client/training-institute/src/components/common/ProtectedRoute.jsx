import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();

  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname, course: location.state?.course }} replace />;
  }

  const userRole = (user.role && user.role.name) || user.legacyRole || (user.isAdmin ? 'admin' : 'student');

  // Skip strict checks for admins/teachers
  if (userRole === 'student') {
    // If they haven't completed profile, force them to /complete-profile
    if (!user.profileCompleted && location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />;
    }

    // If they have completed profile but not enrolled, force them to /enrollment
    if (user.profileCompleted && user.enrollmentStatus !== 'ENROLLED' && location.pathname !== '/enrollment' && location.pathname !== '/complete-profile') {
      return <Navigate to="/enrollment" replace />;
    }
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole) && !allowedRoles.includes(userRole.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
