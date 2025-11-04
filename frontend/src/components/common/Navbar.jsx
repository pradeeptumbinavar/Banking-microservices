import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLanding = location.pathname === '/';
  const isOnboarding = location.pathname.startsWith('/onboarding');
  const isKycPending = location.pathname === '/kyc-pending';
  const isMfaSetup = location.pathname === '/mfa-setup';
  const hideNavItems = isAuthPage || isOnboarding || isKycPending || isMfaSetup;
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'noir');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'noir' : 'light'));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const brandTo = isAuthPage ? '/login' : (user?.role === 'ADMIN' ? '/admin' : '/dashboard');

  return (
    <BSNavbar expand="lg" fixed="top" className="mb-0">
      <Container className="d-flex align-items-center gap-3">
        <BSNavbar.Brand as={Link} to={brandTo} className="d-flex align-items-center gap-2">
          <i className="bi bi-bank"></i>
          <span>Riser ONE</span>
        </BSNavbar.Brand>
        <div className="ms-auto d-flex align-items-center gap-2">
          <Button
            variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
            size="sm"
            onClick={toggleTheme}
            className="px-3 theme-toggle-btn"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'} me-1`}></i>
            {theme === 'light' ? 'Dark' : 'Light'}
          </Button>
          {!hideNavItems && (
            <BSNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
          )}
        </div>
        {!hideNavItems && (
        <BSNavbar.Collapse id="basic-navbar-nav" className="mt-3 mt-lg-0">
          {!(isLanding && !user) && (
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
                  <Nav.Link as={Link} to="/payments">
                    <i className="bi bi-arrow-left-right me-1"></i>
                    Payments
                  </Nav.Link>
                  <Nav.Link as={Link} to="/transactions">
                    <i className="bi bi-receipt me-1"></i>
                    Transactions
                  </Nav.Link>
                  <Nav.Link as={Link} to="/credit">
                    <i className="bi bi-credit-card me-1"></i>
                    Credit
                  </Nav.Link>
                </>
              )}
            </Nav>
          )}
          {user ? (
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
          ) : (
            <Nav className="ms-auto">
              <Link to="/login" className="btn btn-sm btn-primary me-2 hover-grow">Login</Link>
              <Link to="/register" className="btn btn-sm btn-outline-secondary hover-grow">Register</Link>
            </Nav>
          )}
        </BSNavbar.Collapse>
        )}
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
