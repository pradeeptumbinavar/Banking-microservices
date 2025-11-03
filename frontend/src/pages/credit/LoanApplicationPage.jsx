import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { creditService } from '../../services/creditService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoanApplicationPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: 10,
    termMonths: '12'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await creditService.applyForLoan({
        customerId: user?.customerId || user?.id,
        amount: parseFloat(formData.amount),
        interestRate: parseFloat(formData.interestRate),
        termMonths: parseInt(formData.termMonths)
      });
      toast.success('Loan application submitted!');
      navigate('/credit');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <Card className="glass-form-card glass-nav border-0">
        <Card.Header className="pb-0">
          <h4 className="mb-1">Loan Application</h4>
          <p className="mb-0">Fill in the credit request details below.</p>
        </Card.Header>
        <Card.Body className="pt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Loan Amount</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Interest Rate</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={formData.interestRate}
                  readOnly
                />
                <InputGroup.Text>%</InputGroup.Text>
              </InputGroup>
              <Form.Text>Fixed promotional APR.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Term (Months)</Form.Label>
              <Form.Select
                value={formData.termMonths}
                onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
              >
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoanApplicationPage;

