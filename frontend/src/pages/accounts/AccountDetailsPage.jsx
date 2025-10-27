import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const AccountDetailsPage = () => {
  const { id } = useParams();

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <h3>Account Details</h3>
          <p>Account ID: {id}</p>
          <p className="text-muted">Full account details coming soon...</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AccountDetailsPage;

