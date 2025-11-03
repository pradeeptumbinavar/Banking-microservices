import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    accountType: 'SAVINGS',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.customerId) {
        toast.error('Customer profile not found. Please complete onboarding.');
        return;
      }
      await accountService.createAccount({ ...formData, customerId: user.customerId });
      toast.success('Account created successfully!');
      navigate('/dashboard', { state: { refresh: 'accounts' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <Card className="glass-form-card glass-nav border-0">
        <Card.Header className="pb-0">
          <h4 className="mb-1">Open New Account</h4>
          <p className="mb-0">Choose the account type and currency to get started.</p>
        </Card.Header>
        <Card.Body className="pt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Account Type</Form.Label>
              <Form.Select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                required
              >
                <option value="SAVINGS">Savings</option>
                <option value="CHECKING">Checking</option>
                <option value="BUSINESS">Business</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                required
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupees</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAccountPage;

