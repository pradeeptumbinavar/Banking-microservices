import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function MfaSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const qr = location.state?.mfaQrCode;

  const handleContinue = () => {
    navigate('/onboarding/profile');
  };

  return (
    <div className="with-bg auth-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 720 }}>
        <Card className="glass-nav border-0" style={{ borderRadius: '1.5rem' }}>
          <Card.Body style={{ padding: '2.75rem 3rem', color: 'var(--text)' }}>
            <div className="mb-4 text-center">
              <h2 className="fw-bold mb-3" style={{ color: 'var(--text)' }}>Secure your account</h2>
              <p className="text-muted mb-0">Scan this QR code with Google Authenticator, Microsoft Authenticator, or any TOTP app. After scanning, use the generated 6‑digit code to sign in.</p>
            </div>

            <div className="d-flex justify-content-center mb-4">
              {qr ? (
                <img src={qr} alt="MFA QR Code" style={{ width: 260, height: 260, borderRadius: 12, border: '1px solid var(--border)' }} />
              ) : (
                <div className="text-center text-muted">QR code unavailable. You can proceed and set up later from your profile.</div>
              )}
            </div>

            <div className="text-center">
              <Button variant="primary" className="hover-grow" onClick={handleContinue}>
                Continue
              </Button>
              <div className="mt-3">
                <Link to="/login" style={{ color: 'var(--primary)' }}>Back to login</Link>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
