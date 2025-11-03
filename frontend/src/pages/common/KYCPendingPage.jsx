import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const KYCPendingPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div 
      className="with-bg auth-shell"
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <Container className="text-center" style={{ maxWidth: '600px' }}>
        <Card className="glass-nav border-0" style={{ borderRadius: '1.5rem' }}>
          <Card.Body className="p-5">
            <div className="mb-4">
              <i 
                className="bi bi-hourglass-split" 
                style={{ 
                  fontSize: '5rem', 
                  color: 'var(--warning-color)' 
                }}
              ></i>
            </div>
            
            <h2 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>
              KYC Approval Pending
            </h2>
            
            <p className="text-muted mb-4" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
              Your account has been created successfully, but your KYC (Know Your Customer) 
              verification is currently pending approval from our administrators.
            </p>
            
            <div 
              className="alert alert-warning mb-4" 
              role="alert"
              style={{ 
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid var(--warning-color)'
              }}
            >
              <i className="bi bi-info-circle me-2"></i>
              <strong>What's next?</strong><br/>
              Once an administrator approves your KYC, you'll be able to access all banking features. 
              This usually takes 1-2 business days.
            </div>
            
            <div className="mb-4">
              <h5 className="fw-semibold mb-3" style={{ color: 'var(--text)' }}>While you wait:</h5>
              <ul className="list-unstyled text-start mx-auto" style={{ maxWidth: '400px', color: 'var(--text)' }}>
                <li className="mb-2">
                  <i className="bi bi-check-circle me-2" style={{ color: 'var(--primary)' }}></i>
                  Your registration is complete
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle me-2" style={{ color: 'var(--primary)' }}></i>
                  Your customer profile has been created
                </li>
                <li className="mb-2">
                  <i className="bi bi-clock me-2" style={{ color: 'var(--primary)' }}></i>
                  KYC approval in progress
                </li>
              </ul>
            </div>
            
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleLogout}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.0625rem',
                  borderRadius: '0.75rem'
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Button>
            </div>
            
            <p className="text-muted mt-4 mb-0" style={{ fontSize: '0.9375rem' }}>
              You'll receive an email notification once your KYC is approved.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default KYCPendingPage;

