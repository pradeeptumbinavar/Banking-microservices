import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const AdminDashboard = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <h3>0</h3>
              <p className="text-muted">Pending Approvals</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h3>0</h3>
              <p className="text-muted">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h3>0</h3>
              <p className="text-muted">Total Accounts</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

