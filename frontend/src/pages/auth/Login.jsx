import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '', mfaCode: '' });
  const [hasMfa, setHasMfa] = useState(false);
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
    <div className="login-page with-bg auth-shell" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '520px', marginTop: '0.5rem' }}>

        <Card className="glass-nav border-0" style={{ borderRadius: '1.5rem' }}>
          <Card.Body style={{ padding: '2.75rem 3rem', color: 'var(--text)' }}>
            <div className="mb-5">
              <h2 className="fw-bold mb-3" style={{ fontSize: '2rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>
                Welcome back
              </h2>
              <p className="mb-0" style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text)', opacity: 0.85 }}>
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
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
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
                  style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
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
                  style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                />
              </Form.Group>

              {/* MFA code input (optional) */}
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="hasMfa" checked={hasMfa} onChange={(e) => setHasMfa(e.target.checked)} />
                <label className="form-check-label" htmlFor="hasMfa" style={{ color: 'var(--text)' }}>
                  I use an authenticator app (MFA)
                </label>
              </div>
              {hasMfa && (
                <Form.Group className="mb-4" controlId="mfaCode">
                  <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--muted)' }}>
                    6‑digit MFA code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="mfaCode"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    placeholder="Enter 6‑digit code"
                    value={credentials.mfaCode}
                    onChange={handleChange}
                    autoComplete="one-time-code"
                    style={{ padding: '0.875rem 1rem', fontSize: '1.05rem', backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }}
                  />
                </Form.Group>
              )}

              <div className="mt-4 pt-1">
                <Button variant="primary" type="submit" className="w-100 fw-semibold hover-grow" disabled={loading} style={{ padding: '1rem 1.75rem', fontSize: '1.0625rem', borderRadius: '0.75rem' }}>
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
                <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: 'var(--primary)', fontSize: '1.0625rem' }}>
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
