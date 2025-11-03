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
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
      const lookupId = user?.customerId || user?.id;
      if (!lookupId) {
        toast.error('Unable to determine customer. Please re-login.');
        setLoans([]);
        setCards([]);
        return;
      }
      setLoading(true);
      try {
        const data = await creditService.getCreditProductsByUserId(lookupId);
        const list = Array.isArray(data) ? data : [];
        const normalizeType = (item) => {
          const raw = item?.productType || item?.type || item?.creditType || '';
          return typeof raw === 'string' ? raw.toUpperCase() : '';
        };
        const loanItems = list.filter(item => normalizeType(item) === 'LOAN');
        const cardItems = list.filter(item => normalizeType(item).includes('CARD'));
        setLoans(loanItems);
        setCards(cardItems);
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to load credit products');
      } finally {
        setLoading(false);
      }
    };
    fetchCredits();
  }, [user?.customerId, user?.id]);

  return (
    <Container className="py-4">
      <h2 className="mb-4" style={{ color: 'var(--text)' }}>Credit Products</h2>
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="glass-nav border-0">
            <Card.Body>
              <h4 style={{ color: 'var(--text)' }}>Personal Loan</h4>
              <p className="text-muted">Apply for a personal loan</p>
              <Button as={Link} to="/credit/loan/apply" variant="primary">
                Apply Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="glass-nav border-0">
            <Card.Body>
              <h4 style={{ color: 'var(--text)' }}>Credit Card</h4>
              <p className="text-muted">Explore our credit card lineup</p>
              <Button as={Link} to="/credit/cards" variant="primary">
                Apply Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="glass-nav border-0">
        <Card.Header className="bg-transparent border-0">
          <h5 className="mb-0" style={{ color: 'var(--text)' }}>Your Loans</h5>
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

      <Card className="glass-nav border-0 mt-4">
        <Card.Header className="bg-transparent border-0">
          <h5 className="mb-0" style={{ color: 'var(--text)' }}>Your Cards</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <LoadingSpinner text="Loading cards..." />
          ) : cards.length === 0 ? (
            <p className="text-muted mb-0">No cards yet.</p>
          ) : (
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Credit Limit</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {cards.map(card => (
                  <tr key={card.id}>
                    <td>{card.id}</td>
                    <td>{typeof card.creditLimit === 'number' ? card.creditLimit.toLocaleString() : card.creditLimit || '-'}</td>
                    <td>{card.interestRate != null ? `${card.interestRate}%` : '-'}</td>
                    <td>
                      <Badge bg={card.status === 'APPROVED' ? 'success' : card.status === 'PENDING' ? 'warning' : card.status === 'REJECTED' ? 'danger' : 'secondary'}>
                        {card.status || 'PENDING'}
                      </Badge>
                    </td>
                    <td>{card.createdAt ? new Date(card.createdAt).toLocaleString() : '-'}</td>
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

