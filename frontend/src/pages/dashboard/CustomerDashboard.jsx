import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
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

  const statCardStyle = {
    borderRadius: 'var(--radius-2xl)',
    background: 'linear-gradient(145deg, rgba(78, 95, 160, 0.24), rgba(28, 24, 68, 0.12))',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    boxShadow: '0 18px 40px rgba(6, 10, 28, 0.18)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    overflow: 'hidden'
  };

  const statLabelStyle = {
    color: 'rgba(228, 231, 255, 0.7)',
    fontSize: '0.75rem',
    letterSpacing: '0.08em'
  };

  const statValueStyle = {
    fontSize: '2rem',
    color: '#f6f7ff'
  };

  const trendPositiveStyle = {
    color: '#34d399'
  };

  const accountsShellStyle = {
    borderRadius: 'var(--radius-2xl)',
    background: 'linear-gradient(150deg, rgba(12, 16, 37, 0.92) 0%, rgba(22, 19, 46, 0.9) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  };

  const accountItemStyle = {
    background: 'rgba(20, 24, 46, 0.92)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-xl)',
    transition: 'all var(--transition-base)',
    color: '#f4f6ff'
  };

  const quickActionCardStyle = {
    borderRadius: 'var(--radius-2xl)',
    background: 'linear-gradient(160deg, rgba(72, 92, 168, 0.22) 0%, rgba(34, 30, 78, 0.14) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(20px) saturate(150%)',
    WebkitBackdropFilter: 'blur(20px) saturate(150%)'
  };

  const quickActionButtonStyle = {
    padding: '1rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(58, 76, 138, 0.18)',
    color: 'var(--text)'
  };

  const quickActionSubtle = {
    color: 'rgba(228, 231, 255, 0.7)'
  };

  return (
    <Container fluid className="dashboard-container" style={{ minHeight: '100vh' }}>
      {/* Welcome Header */}
      <div className="mb-5">
        <h1 className="fw-bold mb-2" style={{ fontSize: '2.25rem', color: 'var(--primary)' }}>
          Welcome back, {user?.username}!{' '}
          <span style={{ display: 'inline-block', width: 80, height: 80, verticalAlign: 'middle' }}>
            <DotLottieReact
              src="https://lottie.host/37d27ab1-eb7e-4594-a292-38af58df2e02/BqKK0ZGDz6.lottie"
              loop
              autoplay
              style={{ width: '60px', height: '60px' }}
            />
          </span>
        </h1>
        <p className="text-muted mb-0" style={{ fontSize: '1.125rem' }}>
          Here's your financial overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col lg={4} md={6}>
          <Card className="border-0 h-100" style={statCardStyle}>
            <Card.Body className="p-4" style={{ color: '#f6f7ff' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-semibold" style={statLabelStyle}>
                    Total Balance
                  </p>
                  <h2 className="fw-bold mb-0" style={statValueStyle}>
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
              <div className="d-flex align-items-center" style={trendPositiveStyle}>
                <i className="bi bi-arrow-up me-1"></i>
                <small className="fw-semibold">+2.5% from last month</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card className="border-0 h-100" style={statCardStyle}>
            <Card.Body className="p-4" style={{ color: '#f6f7ff' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-semibold" style={statLabelStyle}>
                    Active Accounts
                  </p>
                  <h2 className="fw-bold mb-0" style={statValueStyle}>
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
              <div>
                <small className="fw-semibold" style={{ color: 'rgba(228, 231, 255, 0.7)' }}>
                  All accounts active
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card className="border-0 h-100" style={statCardStyle}>
            <Card.Body className="p-4" style={{ color: '#f6f7ff' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted mb-2 text-uppercase fw-semibold" style={statLabelStyle}>
                    Quick Action
                  </p>
                  <h5 className="fw-semibold mb-0" style={{ color: '#f6f7ff' }}>
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
                to="/payments" 
                className="w-100 fw-semibold"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary)',
                  border: 'none',
                  boxShadow: '0 16px 30px rgba(80, 109, 255, 0.32)'
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
          <Card className="glass-nav border-0" style={accountsShellStyle}>
            <Card.Body className="p-4" style={{ color: '#f6f7ff' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">
                    Your Accounts
                  </h4>
                  <p className="mb-0" style={{ fontSize: '0.9375rem', color: 'rgba(228, 231, 255, 0.7)' }}>
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontSize: '0.9375rem',
                    boxShadow: '0 12px 28px rgba(79, 70, 229, 0.35)'
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
                      background: 'rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <i className="bi bi-wallet2 text-muted" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ color: '#f6f7ff' }}>No accounts yet</h5>
                  <p className="mb-4" style={{ color: 'rgba(228, 231, 255, 0.7)' }}>Create your first account to get started</p>
                  <Button 
                    as={Link} 
                    to="/accounts/create" 
                    className="fw-semibold"
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 12px 28px rgba(79, 70, 229, 0.35)'
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
                        style={accountItemStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 16px 35px rgba(6, 10, 30, 0.4)';
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
                              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.75) 0%, rgba(139, 92, 246, 0.85) 100%)'
                            }}
                          >
                            <i className="bi bi-wallet2 text-white" style={{ fontSize: '1.25rem' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-semibold mb-1" style={{ color: '#f6f7ff' }}>
                              {account.accountType} Account
                            </h6>
                            <small style={{ color: 'rgba(228, 231, 255, 0.65)' }}>
                              {account.accountNumber}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <h5 className="fw-bold mb-1" style={{ color: '#f6f7ff' }}>
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
          <Card className="glass-nav border-0 mb-4" style={quickActionCardStyle}>
            <Card.Body className="p-4" style={{ color: '#f6f7ff' }}>
              <h5 className="fw-bold mb-4">
                Quick Actions
              </h5>
              <div className="d-flex flex-column gap-3">
                <Button 
                  as={Link} 
                  to="/payments" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={quickActionButtonStyle}
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
                    <div style={{ color: '#f6f7ff', fontSize: '0.9375rem' }}>Transfer Money</div>
                    <small style={quickActionSubtle}>Send funds to accounts</small>
                  </div>
                </Button>

                <Button 
                  as={Link} 
                  to="/accounts/create" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={quickActionButtonStyle}
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
                    <div style={{ color: '#f6f7ff', fontSize: '0.9375rem' }}>Open Account</div>
                    <small style={quickActionSubtle}>Create new account</small>
                  </div>
                </Button>

                <Button 
                  as={Link} 
                  to="/credit" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={quickActionButtonStyle}
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
                    <div style={{ color: '#f6f7ff', fontSize: '0.9375rem' }}>Apply for Credit</div>
                    <small style={quickActionSubtle}>Loans & credit cards</small>
                  </div>
                </Button>

                <Button 
                  as={Link} 
                  to="/payments" 
                  variant="light"
                  className="d-flex align-items-center justify-content-start text-start fw-semibold"
                  style={quickActionButtonStyle}
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
                    <div style={{ color: '#f6f7ff', fontSize: '0.9375rem' }}>Transactions</div>
                    <small style={quickActionSubtle}>View transactions</small>
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

