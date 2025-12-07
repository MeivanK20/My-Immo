import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/authContext';
import { UserRole } from '../types';
import { RoutePath } from '../types';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={RoutePath.LOGIN} replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return <Navigate to={RoutePath.HOME} replace />;
    }
  }

  return element;
};
