import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(credentials);
      if (result && result.user) {
        const { role, customerId, kycStatus } = result.user;
        if (role === 'ADMIN') {
          navigate('/admin');
          return;
        }
        // CUSTOMER routing: onboarding-first approach
        if (!customerId) {
          navigate('/onboarding/profile');
          return;
        }
        if (!kycStatus) {
          navigate('/onboarding/kyc');
          return;
        }
        if (kycStatus === 'APPROVED') {
          navigate('/dashboard');
        } else if (kycStatus === 'REJECTED') {
          navigate('/onboarding/kyc?resubmit=1');
        } else {
          navigate('/kyc-pending');
        }
      }
    } catch (err) {
      // Error handled in context
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-page" style={{ 
      background: 'var(--background-gradient)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '40vw', minWidth: '500px' }}>
        <div className="text-center mb-5">
          <div className="mb-4">
            <i className="bi bi-bank2 text-white" style={{ fontSize: '5rem' }}></i>
          </div>
          <h1 className="text-white fw-bold mb-2" style={{ fontSize: '2.75rem', letterSpacing: '-0.02em' }}>
            Banking Portal
          </h1>
          <p className="text-white opacity-75" style={{ fontSize: '1.25rem' }}>
            Secure, Modern, Simple
          </p>
        </div>

        <Card className="border-0" style={{ borderRadius: '1.5rem' }}>
          <Card.Body style={{ padding: '3.5rem 4rem' }}>
            <div className="mb-5">
              <h2 className="fw-bold mb-3" style={{ fontSize: '2rem', color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>
                Welcome back
              </h2>
              <p className="text-muted mb-0" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4" style={{ borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="username">
                <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                  Username
                </Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  style={{ 
                    padding: '1.125rem 1.5rem',
                    fontSize: '1.0625rem',
                    borderRadius: '0.75rem',
                    border: '2px solid var(--gray-200)',
                    transition: 'all 0.2s'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-5" controlId="password">
                <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  style={{ 
                    padding: '1.125rem 1.5rem',
                    fontSize: '1.0625rem',
                    borderRadius: '0.75rem',
                    border: '2px solid var(--gray-200)',
                    transition: 'all 0.2s'
                  }}
                />
              </Form.Group>

              <div className="mt-5 pt-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 fw-semibold"
                  disabled={loading}
                  style={{
                    padding: '1.125rem 2rem',
                    fontSize: '1.125rem',
                    borderRadius: '0.75rem',
                    background: 'var(--primary-color)',
                    border: 'none',
                    letterSpacing: '0.015em',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </Form>

            <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid var(--gray-200)' }}>
              <p className="text-muted mb-0" style={{ fontSize: '1.0625rem' }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="fw-semibold text-decoration-none"
                  style={{ color: 'var(--primary-color)', fontSize: '1.0625rem' }}
                >
                  Create one now →
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        <p className="text-center text-white opacity-50 mt-5 mb-0" style={{ fontSize: '0.9375rem' }}>
          © 2024 Banking Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
