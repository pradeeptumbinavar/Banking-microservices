import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
      try {
        const data = await accountService.getAccountsByUserId(user.id);
        setAccounts(data);
      } catch (error) {
        toast.error('Failed to fetch accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user.id]);

  if (loading) {
    return <LoadingSpinner text="Loading accounts..." />;
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <i className="bi bi-wallet2 me-2"></i>
              My Accounts
            </h2>
            <Button as={Link} to="/accounts/create" variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              Open New Account
            </Button>
          </div>
        </Col>
      </Row>

      {accounts.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i className="bi bi-wallet display-1 text-muted"></i>
            <h4 className="mt-3">No Accounts Yet</h4>
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
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-1">{account.accountType}</h5>
                      <small className="text-muted">{account.accountNumber}</small>
                    </div>
                    <span className={`badge bg-${account.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                      {account.status}
                    </span>
                  </div>
                  
                  <hr />
                  
                  <div className="mb-3">
                    <small className="text-muted d-block">Balance</small>
                    <h3 className="mb-0">${account.balance?.toLocaleString() || '0'}</h3>
                    <small className="text-muted">{account.currency}</small>
                  </div>
                  
                  <Button as={Link} to={`/accounts/${account.id}`} variant="outline-primary" className="w-100">
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

