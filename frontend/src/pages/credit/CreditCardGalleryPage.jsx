import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import card1Img from '../../assets/images/card1.png';
import card2Img from '../../assets/images/card2.png';
import card3Img from '../../assets/images/card3.png';
import { creditService } from '../../services/creditService';
import { useAuth } from '../../hooks/useAuth';

const cards = [
  {
    id: 'aurora',
    name: 'Aurora Platinum',
    description: 'Premium rewards with airport lounge access and accelerated points on travel.',
    image: card1Img,
    creditLimit: 20000,
    interestRate: 16.5,
  },
  {
    id: 'eclipse',
    name: 'Eclipse CashBack',
    description: 'Flat cashback on everyday spending plus bonuses on dining and groceries.',
    image: card2Img,
    creditLimit: 15000,
    interestRate: 18.2,
  },
  {
    id: 'nova',
    name: 'Nova Starter',
    description: 'Low annual fee card for building credit with fraud protection and alerts.',
    image: card3Img,
    creditLimit: 8000,
    interestRate: 19.9,
  },
];

const CreditCardGalleryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submittingId, setSubmittingId] = useState(null);

  const handleApply = async (card) => {
    const customerId = user?.customerId || user?.id;
    if (!customerId) {
      toast.error('Unable to determine customer. Please re-login.');
      return;
    }
    setSubmittingId(card.id);
    try {
      await creditService.applyForCreditCard({
        customerId,
        creditLimit: card.creditLimit,
        interestRate: card.interestRate,
      });
      toast.success(`${card.name} application submitted`);
      navigate('/credit', { state: { refresh: 'credits' } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="mb-1" style={{ color: 'var(--heading-color)' }}>Choose Your Card</h2>
          <p className="mb-0" style={{ color: 'color-mix(in srgb, var(--heading-color) 75%, transparent)' }}>
            Compare designs and perks, then continue to start your application.
          </p>
        </div>
        <Button as={Link} to="/credit" variant="outline-primary">
          Back to Credit Products
        </Button>
      </div>

      <Row className="g-4">
        {cards.map(card => (
          <Col key={card.id} lg={4} md={6}>
            <Card className="glass-nav border-0 h-100">
              <Card.Body className="d-flex flex-column gap-3">
                <div
                  className="position-relative mx-auto"
                  style={{
                    width: '100%',
                    maxWidth: 260,
                    aspectRatio: '1.6',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    boxShadow: '0 18px 45px rgba(8, 11, 26, 0.45)',
                  }}
                >
                  <img
                    src={card.image}
                    alt={`${card.name} card`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                </div>
                <div>
                  <h5 style={{ color: 'var(--text)' }}>{card.name}</h5>
                  <p className="text-muted mb-0">{card.description}</p>
                  <div className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    <div>Credit limit: {card.creditLimit.toLocaleString()}</div>
                    <div>APR: {card.interestRate}%</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleApply(card)}
                    disabled={submittingId === card.id}
                  >
                    {submittingId === card.id ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      `Apply for ${card.name}`
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CreditCardGalleryPage;
