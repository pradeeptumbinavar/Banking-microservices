import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { creditService } from '../../services/creditService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoanApplicationPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: '5.5',
    termMonths: '12'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await creditService.applyForLoan({
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
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">Loan Application</h4>
        </Card.Header>
        <Card.Body>
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

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoanApplicationPage;

