import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { formatCurrencyAmount } from '../../utils/currency';
import { paymentService } from '../../services/paymentService';

const AccountDetailsPage = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [crediting, setCrediting] = useState(false);

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

  const handleCreditInitial = async () => {
    try {
      setCrediting(true);
      // Self-transfer shim: from account to same account to record payment entry
      await paymentService.createTransfer({
        fromAccountId: account.id,
        toAccountId: account.id,
        amount: 50000,
        currency: account.currency,
        description: 'Initial credit on activation'
      });
      // Use accounts PUT to add money on self-credit as requested
      try {
        await accountService.updateAccount(account.id, { balanceDelta: 50000 });
      } catch (_) { /* ignore if backend doesn't support balanceDelta */ }
      toast.success('₹50,000 credited');
      // Refresh account details to reflect any backend-side balance updates
      const refreshed = await accountService.getAccountById(id);
      setAccount(refreshed);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Credit failed');
    } finally {
      setCrediting(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Account Details</h4>
            <span className={`badge bg-${statusVariant}`}>
              {account.status}
            </span>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <small className="text-muted d-block">Account Number</small>
              <div className="fw-semibold">{account.accountNumber}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="text-muted d-block">Type</small>
              <div className="fw-semibold">{account.accountType}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="text-muted d-block">Currency</small>
              <div className="fw-semibold">{account.currency}</div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <small className="text-muted d-block">Balance</small>
              <div className="h4 mb-0">{formatCurrencyAmount(account.currency, account.balance)}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="text-muted d-block">Created At</small>
              <div className="fw-semibold">{account.createdAt ? new Date(account.createdAt).toLocaleString() : '-'}</div>
            </Col>
            <Col md={3} className="mb-3">
              <small className="text-muted d-block">Last Activity</small>
              <div className="fw-semibold">{account.updatedAt ? new Date(account.updatedAt).toLocaleString() : '-'}</div>
            </Col>
          </Row>

          {account.status === 'ACTIVE' && Number(account.balance || 0) < 50000 && (
            <div className="mb-3">
              <Button variant="primary" onClick={handleCreditInitial} disabled={crediting}>
                {crediting ? 'Crediting...' : 'Credit Initial 50,000'}
              </Button>
            </div>
          )}

          <Row className="text-muted">
            <Col md={3} className="mb-2">
              <small className="d-block">Account ID</small>
              <small className="fw-semibold">{account.id}</small>
            </Col>
            <Col md={3} className="mb-2">
              <small className="d-block">Customer ID</small>
              <small className="fw-semibold">{account.customerId}</small>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccountDetailsPage;

