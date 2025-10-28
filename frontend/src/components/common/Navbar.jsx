import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const brandTo = isAuthPage ? '/login' : (user?.role === 'ADMIN' ? '/admin' : '/dashboard');

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BSNavbar.Brand as={Link} to={brandTo}>
          <i className="bi bi-bank me-2"></i>
          Banking Portal
        </BSNavbar.Brand>
        {!isAuthPage && (<>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}>
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            {user?.role !== 'ADMIN' && (
              <>
                <Nav.Link as={Link} to="/accounts">
                  <i className="bi bi-wallet2 me-1"></i>
                  Accounts
                </Nav.Link>
                <Nav.Link as={Link} to="/transfer">
                  <i className="bi bi-arrow-left-right me-1"></i>
                  Transfer
                </Nav.Link>
                <Nav.Link as={Link} to="/payments">
                  <i className="bi bi-receipt me-1"></i>
                  Payments
                </Nav.Link>
                <Nav.Link as={Link} to="/credit">
                  <i className="bi bi-credit-card me-1"></i>
                  Credit
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <NavDropdown 
              title={
                <>
                  <i className="bi bi-person-circle me-1"></i>
                  {user?.username || 'User'}
                </>
              } 
              id="user-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/profile">
                <i className="bi bi-person me-2"></i>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </BSNavbar.Collapse>
        </>)}
      </Container>
    </BSNavbar>
  );
};

export default Navbar;

