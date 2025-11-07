import React, { useState } from 'react';
import { Container, Card, Form, Button, InputGroup, Nav } from 'react-bootstrap';
import { creditService } from '../../services/creditService';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoanApplicationPage = () => {
  const { user } = useAuth();
  const [activeLoanType, setActiveLoanType] = useState('PERSONAL');
  const defaultsByType = {
    HOME: { interestRate: 8.5, termMonths: '240' },
    VEHICLE: { interestRate: 9.5, termMonths: '60' },
    PERSONAL: { interestRate: 12.5, termMonths: '36' },
    EDUCATION: { interestRate: 7.5, termMonths: '84' },
  };

  // Min/Max per loan type (in currency units)
  const limitsByType = {
    HOME: { min: 100000, max: 10000000 },
    VEHICLE: { min: 50000, max: 3000000 },
    PERSONAL: { min: 1000, max: 1000000 },
    EDUCATION: { min: 5000, max: 2000000 },
  };
  const [formData, setFormData] = useState({
    amount: '',
    interestRate: defaultsByType['PERSONAL'].interestRate,
    termMonths: defaultsByType['PERSONAL'].termMonths,
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
        termMonths: parseInt(formData.termMonths),
        loanType: activeLoanType,
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
        <Card.Header className="pb-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <div>
            <h4 className="mb-1">Loan Application</h4>
            <p className="mb-0">Choose a loan type and fill in the details.</p>
          </div>
          <Button as={Link} to="/credit" variant="outline-primary">
            Back to Credit Products
          </Button>
        </Card.Header>
        <Card.Body className="pt-3">
          <Nav variant="tabs" activeKey={activeLoanType} onSelect={(k) => {
            setActiveLoanType(k);
            const def = defaultsByType[k] || defaultsByType['PERSONAL'];
            setFormData((prev) => ({ ...prev, interestRate: def.interestRate, termMonths: def.termMonths }));
          }} className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="HOME">
                <i className="bi bi-house-door me-1" /> Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="VEHICLE">
                <i className="bi bi-car-front me-1" /> Vehicle
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="PERSONAL">
                <i className="bi bi-person-badge me-1" /> Personal
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="EDUCATION">
                <i className="bi bi-mortarboard me-1" /> Education
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Loan Amount</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                min={(limitsByType[activeLoanType]?.min ?? 0)}
                max={(limitsByType[activeLoanType]?.max ?? undefined)}
                step="1000"
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <Form.Text>{`Enter between ${(limitsByType[activeLoanType]?.min ?? 0).toLocaleString()} and ${(limitsByType[activeLoanType]?.max ?? 0).toLocaleString()}`}</Form.Text>
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
                <option value="60">60 Months</option>
                <option value="84">84 Months</option>
                <option value="120">120 Months</option>
                <option value="240">240 Months</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2" disabled={loading} onClick={(e) => {
              const limits = limitsByType[activeLoanType] || limitsByType['PERSONAL'];
              const amt = Number(formData.amount);
              if (Number.isFinite(amt) && (amt < limits.min || amt > limits.max)) {
                e.preventDefault();
                toast.error(`Amount must be between ${limits.min.toLocaleString()} and ${limits.max.toLocaleString()} for ${activeLoanType} loan`);
              }
            }}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoanApplicationPage;

