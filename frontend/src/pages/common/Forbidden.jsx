import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <Container className="text-center py-5">
      <div className="py-5">
        <i className="bi bi-shield-exclamation display-1 text-danger"></i>
        <h1 className="display-4 mt-4">403 - Access Denied</h1>
        <p className="lead text-muted">
          You don't have permission to access this page.
        </p>
        <Button as={Link} to="/dashboard" variant="primary" size="lg" className="mt-3">
          <i className="bi bi-house-door me-2"></i>
          Go to Dashboard
        </Button>
      </div>
    </Container>
  );
};

export default Forbidden;

