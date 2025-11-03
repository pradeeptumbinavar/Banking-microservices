import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { formatCurrencyAmount } from '../../utils/currency';

const AccountDetailsPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const data = await accountService.getAccountById(id);
        setAccount(data);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to load account details';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading account details..." />;
  }

  if (!account) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body>
            <h4>Account not found</h4>
            <p className="text-muted">We couldn't find details for account ID {id}.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const statusVariant = account.status === 'ACTIVE' ? 'success'
    : account.status === 'PENDING' ? 'warning'
    : account.status === 'SUSPENDED' ? 'danger'
    : 'secondary';

  return (
    <Container className="py-4" style={{ maxWidth: 900 }}>
      <Card className="glass-form-card glass-nav border-0">
        <Card.Header className="pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-1">Account Details</h4>
            <span className={`badge bg-${statusVariant}`}>
              {account.status}
            </span>
          </div>
          <p className="mb-0">View balances, identifiers and recent timestamps for this account.</p>
        </Card.Header>
        <Card.Body className="pt-4">
          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Account Number</small>
              <div className="fw-semibold mt-1">{account.accountNumber}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Type</small>
              <div className="fw-semibold mt-1">{account.accountType}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Currency</small>
              <div className="fw-semibold mt-1">{account.currency}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Balance</small>
              <div className="h4 mb-0 mt-1">{formatCurrencyAmount(account.currency, account.balance)}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Created At</small>
              <div className="fw-semibold mt-1">{account.createdAt ? new Date(account.createdAt).toLocaleString() : '-'}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="d-block" style={{ color: 'rgba(228, 231, 255, 0.65)' }}>Last Activity</small>
              <div className="fw-semibold mt-1">{account.updatedAt ? new Date(account.updatedAt).toLocaleString() : '-'}</div>
            </Col>
          </Row>

          <Row style={{ color: 'rgba(228, 231, 255, 0.65)' }}>
            <Col md={3} className="mb-2">
              <small className="d-block">Account ID</small>
              <small className="fw-semibold d-block mt-1" style={{ color: '#f6f7ff' }}>{account.id}</small>
            </Col>
            <Col md={3} className="mb-2">
              <small className="d-block">Customer ID</small>
              <small className="fw-semibold d-block mt-1" style={{ color: '#f6f7ff' }}>{account.customerId}</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccountDetailsPage;

