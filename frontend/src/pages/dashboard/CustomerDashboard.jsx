import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { accountService } from '../../services/accountService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrencyAmount } from '../../utils/currency';
import { toast } from 'react-toastify';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const lookupId = user?.customerId || user?.id;
      if (!lookupId) {
        toast.error('Unable to determine customer. Please re-login.');
        setAccounts([]);
        return;
      }
      const data = await accountService.getAccountsByUserId(lookupId);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to fetch accounts';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.customerId, user?.id]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);
  // Refresh after navigations that request refresh
  useEffect(() => {
    if (location.state?.refresh === 'accounts') {
      fetchAccounts();
    }
  }, [location.state, fetchAccounts]);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const activeCount = accounts.filter(a => a.status === 'ACTIVE').length;

  return (
    <Container fluid className="dashboard-container" style={{ background: 'var(--background-color)', minHeight: '100vh' }}>
      {/* Welcome Header */}
      <div className="mb-5">
        <h1 className="fw-bold mb-2" style={{ fontSize: '2.25rem', color: 'var(--gray-900)' }}>
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-muted mb-0" style={{ fontSize: '1.125rem' }}>
          Here's your financial overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col lg={4} md={6}>
          <Card className="border-0 h-100" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Total Balance
                  </p>
                  <h2 className="fw-bold mb-0" style={{ fontSize: '2rem', color: 'var(--gray-900)' }}>
                    {formatCurrencyAmount(accounts[0]?.currency || 'USD', totalBalance)}
                  </h2>
                </div>
                <div 
                  className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-xl)', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <i className="bi bi-wallet2 text-white" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <div className="d-flex align-items-center text-success">
                <i className="bi bi-arrow-up me-1"></i>
                <small className="fw-semibold">+2.5% from last month</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card className="border-0 h-100" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Active Accounts
                  </p>
                  <h2 className="fw-bold mb-0" style={{ fontSize: '2rem', color: 'var(--gray-900)' }}>
                    {activeCount}
                  </h2>
                </div>
                <div 
                  className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-xl)', 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  }}
                >
                  <i className="bi bi-bank text-white" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <div className="d-flex align-items-center text-muted">
                <small className="fw-semibold">All accounts active</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="border-0 h-100" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    Quick Action
                  </p>
                  <h5 className="fw-semibold mb-0" style={{ color: 'var(--gray-900)' }}>
                    Transfer Funds
                  </h5>
                </div>
                <div 
                  className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-xl)', 
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  }}
                >
                  <i className="bi bi-arrow-left-right text-white" style={{ fontSize: '1.5rem' }}></i>
                </div>
              </div>
              <Button 
                as={Link} 
                to="/transfer" 
                className="w-100 fw-semibold"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary-color)',
                  border: 'none'
                }}
              >
                Transfer Money
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Grid */}
      <Row className="g-4">
        {/* Accounts Section */}
        <Col lg={8}>
          <Card className="border-0" style={{ borderRadius: 'var(--radius-2xl)' }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--gray-900)' }}>
                    Your Accounts
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9375rem' }}>
                    Manage and view your accounts
                  </p>
                </div>
                <Button 
                  as={Link} 
                  to="/accounts/create" 
                  className="fw-semibold"
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--primary-color)',
                    border: 'none',
                    fontSize: '0.9375rem'
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  New Account
                </Button>
              </div>

              {accounts.length === 0 ? (
                <div className="text-center py-5">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--gray-100)'
                    }}
                  >
                    <i className="bi bi-wallet2 text-muted" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ color: 'var(--gray-900)' }}>No accounts yet</h5>
                  <p className="text-muted mb-4">Create your first account to get started</p>
                  <Button 
                    as={Link} 
                    to="/accounts/create" 
                    className="fw-semibold"
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--primary-color)',
                      border: 'none'
                    }}
                  >
                    Create Your First Account
                  </Button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {accounts.map((account) => (
                    <Link
                      key={account.id}
                      to={`/accounts/${account.id}`}
                      className="text-decoration-none"
                    >
                      <div 
                        className="p-4 d-flex justify-content-between align-items-center"
                        style={{
                          background: 'var(--gray-50)',
                          borderRadius: 'var(--radius-xl)',
                          border: '1px solid var(--gray-200)',
                          transition: 'all var(--transition-base)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div 
                            className="d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: 'var(--radius-lg)',
                              background: 'var(--primary-color)'
                            }}
                          >
                            <i className="bi bi-wallet2 text-white" style={{ fontSize: '1.25rem' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1" style={{ color: 'var(--gray-900)' }}>
                              {account.accountType} Account
                            </h6>
                            <small className="text-muted">
                              {account.accountNumber}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <h5 className="fw-bold mb-1" style={{ color: 'var(--gray-900)' }}>
                            {formatCurrencyAmount(account.currency, account.balance)}
                          </h5>
                          <span 
                            className={`badge ${account.status === 'ACTIVE' ? 'bg-success' : account.status === 'PENDING' ? 'bg-warning' : account.status === 'SUSPENDED' ? 'bg-danger' : 'bg-secondary'}`}
                            style={{
                              padding: '0.375rem 0.75rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem'
                            }}
                          >
                            {account.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions Sidebar */}
        <Col lg={4}>
          <Card className="border-0 mb-4" style={{ borderRadius: 'var(--radius-2xl)' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--gray-900)' }}>
                Quick Actions
              </h5>
              <div className="d-flex flex-column gap-3">
                <Button 
                  as={Link} 
                  to="/transfer" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--gray-200)',
                    background: 'white'
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <i className="bi bi-arrow-left-right text-white"></i>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-900)', fontSize: '0.9375rem' }}>Transfer Money</div>
                    <small className="text-muted">Send funds to accounts</small>
                  </div>
                </Button>

                <Button 
                  as={Link} 
                  to="/accounts/create" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--gray-200)',
                    background: 'white'
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    }}
                  >
                    <i className="bi bi-plus-circle text-white"></i>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-900)', fontSize: '0.9375rem' }}>Open Account</div>
                    <small className="text-muted">Create new account</small>
                  </div>
                </Button>

                <Button 
                  as={Link} 
                  to="/credit" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--gray-200)',
                    background: 'white'
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                    }}
                  >
                    <i className="bi bi-credit-card text-white"></i>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-900)', fontSize: '0.9375rem' }}>Apply for Credit</div>
                    <small className="text-muted">Loans & credit cards</small>
                  </div>
                </Button>

                <Button 
                  as={Link} 
                  to="/payments" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--gray-200)',
                    background: 'white'
                  }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                    }}
                  >
                    <i className="bi bi-receipt text-white"></i>
                  </div>
                  <div>
                    <div style={{ color: 'var(--gray-900)', fontSize: '0.9375rem' }}>Payment History</div>
                    <small className="text-muted">View transactions</small>
                  </div>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerDashboard;

