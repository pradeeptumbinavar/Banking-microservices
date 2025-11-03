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
    role: 'CUSTOMER',
    mfaEnabled: false
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
      // If MFA was requested and QR provided, route to setup page first
      if (result?.mfaQrCode) {
        navigate('/mfa-setup', { state: { mfaQrCode: result.mfaQrCode } });
        return;
      }
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
    <div className="register-page with-bg auth-shell" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '640px', marginTop: '0.5rem' }}>

        <Card className="glass-nav border-0" style={{ borderRadius: '1.5rem' }}>
          <Card.Body style={{ padding: '2.75rem 3rem', color: 'var(--text)' }}>
            <div className="mb-5">
              <h2 className="fw-bold mb-3" style={{ fontSize: '2rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Create Account
              </h2>
              <p className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text)', opacity: 0.85 }}>
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
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
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
                      style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
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
                      style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="g-4">
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
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
                      style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                    />
                    <Form.Text className="text-muted" style={{ fontSize: '0.9375rem' }}>
                      At least 6 characters
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
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
                      style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* MFA opt-in */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="mfaEnabled"
                  checked={formData.mfaEnabled}
                  onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="mfaEnabled" style={{ color: 'var(--text)' }}>
                  Enable two-factor authentication (Authenticator app)
                </label>
              </div>

              {/* Role is automatically set to CUSTOMER - Admin accounts are created manually */}

              <div className="mt-4 pt-1">
                <Button variant="primary" type="submit" className="w-100 fw-semibold hover-grow" disabled={loading} style={{ padding: '1rem 1.75rem', fontSize: '1.0625rem', borderRadius: '0.75rem' }}>
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
                <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--primary)', fontSize: '1.0625rem' }}>
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
