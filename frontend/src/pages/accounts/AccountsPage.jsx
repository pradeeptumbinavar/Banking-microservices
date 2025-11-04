import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatCurrencyAmount } from '../../utils/currency';
import { accountService } from '../../services/accountService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const AccountsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const lookupId = user?.customerId || user?.id;
        if (!lookupId) {
          toast.error('Unable to determine customer. Please re-login.');
          return;
        }
        const data = await accountService.getAccountsByUserId(lookupId);
        setAccounts(Array.isArray(data) ? data : []);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to fetch accounts';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user?.customerId, user?.id]);

  if (loading) {
    return <LoadingSpinner text="Loading accounts..." />;
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div className="section-heading section-heading--compact">
              <span className="section-heading__icon">
                <i className="bi bi-wallet2" />
              </span>
              <h2 className="section-heading__title">My Accounts</h2>
            </div>
            <Button as={Link} to="/accounts/create" variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              Open New Account
            </Button>
          </div>
        </Col>
      </Row>

      {accounts.length === 0 ? (
        <Card className="glass-nav border-0 text-center py-5">
          <Card.Body>
            <i className="bi bi-wallet display-1 text-muted"></i>
            <h4 className="mt-3" style={{ color: 'var(--text)' }}>No Accounts Yet</h4>
            <p className="text-muted">Get started by opening your first account</p>
            <Button as={Link} to="/accounts/create" variant="primary">
              Open Account
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {accounts.map((account) => (
            <Col key={account.id} md={6} lg={4}>
              <Card className="glass-nav border-0 h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-1" style={{ color: '#f6f7ff' }}>{account.accountType}</h5>
                      <small style={{ color: 'rgba(228, 231, 255, 0.65)' }}>{account.accountNumber}</small>
                    </div>
                    <span className={`badge bg-${account.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                      {account.status}
                    </span>
                  </div>
                  
                  <hr />
                  
                  <div className="mb-3">
                    <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Balance</small>
                    <h3 className="mb-0" style={{ color: '#f6f7ff' }}>{formatCurrencyAmount(account.currency, account.balance)}</h3>
                  </div>
                  
                  <Button as={Link} to={`/accounts/${account.id}`} variant="outline-light" className="w-100">
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AccountsPage;
