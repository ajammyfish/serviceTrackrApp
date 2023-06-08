import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoggedOutHome from '../pages/LoggedOutHome'
import NavBar from '../components/NavBar'


const PrivateRoutes = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User is not authenticated, redirect to login
    return <LoggedOutHome />;
  }

  // User is authenticated, render the protected routes
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default PrivateRoutes;
