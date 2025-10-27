import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CreditProductsPage = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Credit Products</h2>
      <Row className="g-4">
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
    </Container>
  );
};

export default CreditProductsPage;

