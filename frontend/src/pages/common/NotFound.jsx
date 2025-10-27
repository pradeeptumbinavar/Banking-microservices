import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <div className="py-5">
        <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        <h1 className="display-4 mt-4">404 - Page Not Found</h1>
        <p className="lead text-muted">
          The page you're looking for doesn't exist.
        </p>
        <Button as={Link} to="/dashboard" variant="primary" size="lg" className="mt-3">
          <i className="bi bi-house-door me-2"></i>
          Go to Dashboard
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;

