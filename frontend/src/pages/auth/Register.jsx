import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER'
  });
  const [validationError, setValidationError] = useState('');
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      // New flow: after signup, go to onboarding profile
      if (result?.success) {
        navigate('/onboarding/profile');
      }
    } catch (err) {
      // Error handled in context
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-page" style={{ 
      background: 'var(--background-gradient)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '55vw', minWidth: '650px' }}>
        <div className="text-center mb-5">
          <div className="mb-4">
            <i className="bi bi-person-plus-fill text-white" style={{ fontSize: '5rem' }}></i>
          </div>
          <h1 className="text-white fw-bold mb-2" style={{ fontSize: '2.75rem', letterSpacing: '-0.02em' }}>
            Join Banking Portal
          </h1>
          <p className="text-white opacity-75" style={{ fontSize: '1.25rem' }}>
            Create your account in minutes
          </p>
        </div>

        <Card className="border-0" style={{ borderRadius: '1.5rem' }}>
          <Card.Body style={{ padding: '3.5rem 4rem' }}>
            <div className="mb-5">
              <h2 className="fw-bold mb-3" style={{ fontSize: '2rem', color: 'var(--gray-900)', letterSpacing: '-0.02em' }}>
                Create Account
              </h2>
              <p className="text-muted mb-0" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
                Fill in your details to get started
              </p>
            </div>

            {(error || validationError) && (
              <Alert variant="danger" className="mb-4" style={{ borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                <i className="bi bi-exclamation-circle me-2"></i>
                {error || validationError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="username">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
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
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      style={{ 
                        padding: '1.125rem 1.5rem',
                        fontSize: '1.0625rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--gray-200)',
                        transition: 'all 0.2s'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-4">
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      style={{ 
                        padding: '1.125rem 1.5rem',
                        fontSize: '1.0625rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--gray-200)',
                        transition: 'all 0.2s'
                      }}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: '0.9375rem' }}>
                      At least 6 characters
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      style={{ 
                        padding: '1.125rem 1.5rem',
                        fontSize: '1.0625rem',
                        borderRadius: '0.75rem',
                        border: '2px solid var(--gray-200)',
                        transition: 'all 0.2s'
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Role is automatically set to CUSTOMER - Admin accounts are created manually */}

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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </Form>

            <div className="mt-5 pt-5 text-center" style={{ borderTop: '1px solid var(--gray-200)' }}>
              <p className="text-muted mb-0" style={{ fontSize: '1.0625rem' }}>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="fw-semibold text-decoration-none"
                  style={{ color: 'var(--primary-color)', fontSize: '1.0625rem' }}
                >
                  Sign in instead →
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

export default Register;