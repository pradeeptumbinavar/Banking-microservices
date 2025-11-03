import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { paymentService } from '../../services/paymentService';
import { accountService } from '../../services/accountService';
import { formatCurrencyAmount } from '../../utils/currency';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const TransferPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const lookupId = user?.customerId || user?.id;
        if (!lookupId) {
          toast.error('Unable to determine customer. Please re-login.');
          return;
        }
        const data = await accountService.getAccountsByUserId(lookupId);
        setAccounts(data);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to fetch accounts';
        toast.error(msg);
      }
    };
    fetchAccounts();
  }, [user?.customerId, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount);
      // Get current account balances
      const from = await accountService.getAccountById(parseInt(formData.fromAccountId));
      const to = await accountService.getAccountById(parseInt(formData.toAccountId));
      
      // Update balances via PUT
      await accountService.updateAccount(parseInt(formData.fromAccountId), { balance: (parseFloat(from.balance) || 0) - amount });
      await accountService.updateAccount(parseInt(formData.toAccountId), { balance: (parseFloat(to.balance) || 0) + amount });
      
      // Record transaction
      await paymentService.createTransfer({
        ...formData,
        fromAccountId: parseInt(formData.fromAccountId),
        toAccountId: parseInt(formData.toAccountId),
        amount,
        currency: from?.currency || 'USD'
      });
      toast.success('Transfer initiated successfully!');
      setFormData({ fromAccountId: '', toAccountId: '', amount: '', description: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="glass-nav border-0">
            <Card.Header className="bg-transparent border-0">
              <h4 className="mb-0" style={{ color: 'var(--text)' }}>
                <i className="bi bi-arrow-left-right me-2"></i>
                Transfer Money
              </h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>From Account</Form.Label>
                  <Form.Select
                    value={formData.fromAccountId}
                    onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                    required
                  >
                    <option value="">Select account...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountNumber} - {formatCurrencyAmount(acc.currency, acc.balance)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>To Account ID</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.toAccountId}
                    onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                    placeholder="Enter recipient account ID"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                  {loading ? 'Processing...' : 'Transfer Money'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransferPage;

