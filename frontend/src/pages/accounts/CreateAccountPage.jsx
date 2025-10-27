import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { accountService } from '../../services/accountService';
import { toast } from 'react-toastify';

const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    accountType: 'SAVINGS',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await accountService.createAccount(formData);
      toast.success('Account created successfully!');
      navigate('/accounts');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Open New Account</h4>
        </Card.Header>
        <Card.Body>
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
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateAccountPage;

