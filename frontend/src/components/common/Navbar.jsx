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
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    async function loadUnseen() {
      try {
        if (user && user.id) {
          const { notificationService } = await import('../../services/notificationService');
          const count = await notificationService.getUnseenCount(user.id);
          setUnseenCount(Number(count) || 0);
        } else {
          setUnseenCount(0);
        }
      } catch {
        setUnseenCount(0);
      }
    }
    loadUnseen();
  }, [user?.id]);

  // Poll unseen notifications count every 30s so the bell dot stays fresh
  useEffect(() => {
    let timer;
    let cancelled = false;
    async function tick() {
      try {
        if (user && user.id) {
          const { notificationService } = await import('../../services/notificationService');
          const count = await notificationService.getUnseenCount(user.id);
          if (!cancelled) setUnseenCount(Number(count) || 0);
        }
      } catch {
        // ignore polling errors
      }
    }
    if (user && user.id) {
      timer = setInterval(tick, 30000);
    }
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [user?.id]);

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
      <Container>
        <BSNavbar.Brand as={Link} to={brandTo} className="d-flex align-items-center gap-2">
          <i className="bi bi-bank"></i>
          <span>Riser ONE</span>
        </BSNavbar.Brand>

        {hideNavItems ? (
          <div className="ms-auto d-flex align-items-center">
            <Button
              variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
              size="sm"
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'}`} />
            </Button>
          </div>
        ) : (
          <>
            <BSNavbar.Toggle aria-controls="main-nav" className="ms-auto border-0 shadow-none" />
            <BSNavbar.Collapse id="main-nav" className="mt-3 mt-lg-0">
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
              <div className="d-flex align-items-center gap-2 ms-lg-auto position-relative">
                {/* Notifications button */}
                {user && (
                  <div className="me-2">
                    <Button
                      variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
                      size="sm"
                      title="Notifications"
                      onClick={async () => {
                        try {
                          const { notificationService } = await import('../../services/notificationService');
                          // mark-all-seen upon opening, then refresh list & count
                          await notificationService.markAllSeen(user.id).catch(() => {});
                          const list = await notificationService.getByUserId(user.id);
                          setNotifications(Array.isArray(list) ? list.slice(0, 8) : []);
                          setUnseenCount(0);
                          setShowNoti(true);
                        } catch (_) {
                          setNotifications([]);
                          setShowNoti(true);
                        }
                      }}
                    >
                      <span className="position-relative d-inline-block">
                        <i className="bi bi-bell" />
                        {unseenCount > 0 && (
                          <span
                            className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle"
                            style={{ top: 0, right: 0 }}
                          >
                            <span className="visually-hidden">unread notifications</span>
                          </span>
                        )}
                      </span>
                    </Button>
                    {showNoti && (
                      <div className="position-absolute end-0 mt-2 p-2 shadow rounded" style={{ minWidth: 280, zIndex: 1050, background: 'var(--surface)' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong style={{ color: 'var(--text)' }}>Notifications</strong>
                          <Button variant="link" className="p-0" onClick={() => setShowNoti(false)}><i className="bi bi-x-lg" /></Button>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="text-muted">No notifications</div>
                        ) : (
                          <ul className="list-unstyled mb-0" style={{ maxHeight: 280, overflowY: 'auto', width: 360 }}>
                            {notifications.map(n => {
                              const subj = (n.subject || '').toUpperCase();
                              let icon = 'bell';
                              if (subj.startsWith('ACCOUNT')) icon = 'wallet2';
                              else if (subj.startsWith('PAYMENT')) icon = 'arrow-left-right';
                              else if (subj.startsWith('LOAN')) icon = 'house-door';
                              else if (subj.startsWith('CARD') || subj.startsWith('CREDIT')) icon = 'credit-card';
                              return (
                                <li key={n.id} className="mb-2 p-2 rounded" style={{ background: 'color-mix(in srgb, var(--surface) 96%, transparent)' }}>
                                  <div className="d-flex align-items-start gap-2">
                                    <div className="flex-shrink-0">
                                      <span className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 28, height: 28, background: 'color-mix(in srgb, var(--primary) 30%, transparent)', color: 'var(--text)' }}>
                                        <i className={`bi bi-${icon}`} />
                                      </span>
                                    </div>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                      <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem' }}>{n.subject}</div>
                                      <div className="text-muted" style={{ fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.message}</div>
                                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <Button
                  variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
                  size="sm"
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  <i className={`bi ${theme === 'light' ? 'bi-moon-stars' : 'bi-sun'}`} />
                </Button>
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
                  <Nav className="gap-2">
                    <Link to="/login" className="btn btn-sm btn-primary hover-grow">Login</Link>
                    <Link to="/register" className="btn btn-sm btn-outline-secondary hover-grow">Register</Link>
                  </Nav>
                )}
              </div>
            </BSNavbar.Collapse>
          </>
        )}
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
