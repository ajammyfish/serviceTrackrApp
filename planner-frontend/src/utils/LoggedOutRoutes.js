import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoggedOutRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User is not authenticated, redirect to login
    return <Outlet />;
  }

  // User is authenticated, render the protected routes
  return <Navigate to="/"/>;
}

export default LoggedOutRoutes;
