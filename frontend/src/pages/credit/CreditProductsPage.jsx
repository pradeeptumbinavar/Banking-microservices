import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { creditService } from '../../services/creditService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const CreditProductsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const data = await creditService.getCreditProductsByUserId(user.id);
        // Filter to loans only if mixed
        const onlyLoans = (data || []).filter(p => p.paymentType ? false : (p.type || p.creditType || 'LOAN') === 'LOAN');
        setLoans(onlyLoans);
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to load loans');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [user.id]);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Credit Products</h2>
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4>Personal Loan</h4>
              <p className="text-muted">Apply for a personal loan</p>
              <Button as={Link} to="/credit/loan/apply" variant="primary">
                Apply Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4>Credit Card</h4>
              <p className="text-muted">Get a credit card</p>
              <Button variant="outline-primary">Coming Soon</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Your Loans</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <LoadingSpinner text="Loading loans..." />
          ) : loans.length === 0 ? (
            <p className="text-muted mb-0">No loans yet.</p>
          ) : (
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Interest</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{typeof l.amount === 'number' ? l.amount.toLocaleString() : l.amount}</td>
                    <td>{l.interestRate != null ? `${l.interestRate}%` : '-'}</td>
                    <td>{l.termMonths ? `${l.termMonths} mo` : '-'}</td>
                    <td>
                      <Badge bg={l.status === 'APPROVED' ? 'success' : l.status === 'PENDING' ? 'warning' : l.status === 'REJECTED' ? 'danger' : 'secondary'}>
                        {l.status || 'PENDING'}
                      </Badge>
                    </td>
                    <td>{l.createdAt ? new Date(l.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreditProductsPage;

