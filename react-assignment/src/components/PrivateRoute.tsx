import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  console.log('PrivateRoute:', {
    isAuthenticated,
    user,
    pathname: location.pathname,
    state: location.state,
  });

  // Check localStorage as a backup
  const savedAuth = localStorage.getItem('auth');
  const isLocallyAuthenticated = savedAuth
    ? JSON.parse(savedAuth).isAuthenticated
    : false;

  if (!isAuthenticated && !isLocallyAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering protected route');
  return <>{children}</>;
};
