import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { LoadingState } from '../common/LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <LoadingState message="Verificando autenticação..." />
      </div>
    );
  }

  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/entrar?redirect=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
