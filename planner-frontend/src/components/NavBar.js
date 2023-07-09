import React, { useContext } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const NavBar = () => {
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser()
  };

  return (
    <Navbar variant="primary" className='navbar' expand="lg" fluid="true">
    <Navbar.Brand className='navbrand lobsterfont' as={Link} to="/">ServiceTrackr</Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-nav" />
    <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto navlinks">
        <Nav.Link as={Link} to="/">Customers</Nav.Link>
        <Nav.Link as={Link} to="/worksheet">Planner</Nav.Link>
        <Nav.Link as={Link} to="/account">Account</Nav.Link>
        <Nav.Link as={Link} to="/payments">Payment History</Nav.Link>
        <Nav.Link as={Link} to="/debts">Debts</Nav.Link>
        <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
        </Nav>
        <div className="logout-container">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
    </Navbar.Collapse>
    </Navbar>
  )
};

export default NavBar;
