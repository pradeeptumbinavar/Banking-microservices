import React from 'react';
import { Card, Alert } from 'react-bootstrap';

const MFASetup = ({ qrCode, username }) => {
  return (
    <Card className="border-0 shadow-lg mb-4" style={{ borderRadius: '1.5rem' }}>
      <Card.Body className="p-5 text-center">
        <div className="mb-4">
          <i className="bi bi-shield-check" style={{ fontSize: '3rem', color: 'var(--success-color)' }}></i>
        </div>
        
        <h3 className="fw-bold mb-3">Setup Two-Factor Authentication</h3>
        
        <Alert variant="info" className="mb-4 text-start">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Multi-Factor Authentication (MFA) Enabled</strong>
          <p className="mb-0 mt-2">
            Scan this QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, or Authy).
          </p>
        </Alert>
        
        <div className="mb-4 p-4 bg-white rounded" style={{ border: '2px solid var(--gray-200)' }}>
          {qrCode ? (
            <img 
              src={qrCode} 
              alt="MFA QR Code" 
              style={{ maxWidth: '300px', width: '100%' }}
            />
          ) : (
            <div className="text-muted">
              <i className="bi bi-qr-code" style={{ fontSize: '5rem' }}></i>
              <p>QR Code will appear here</p>
            </div>
          )}
        </div>
        
        <div className="text-start">
          <h5 className="fw-semibold mb-3">Next Steps:</h5>
          <ol className="mb-0">
            <li className="mb-2">Open your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)</li>
            <li className="mb-2">Scan the QR code above</li>
            <li className="mb-2">Save the entry as "<strong>{username} - Banking Portal</strong>"</li>
            <li className="mb-2">When logging in, you'll need to enter the 6-digit code from your app</li>
          </ol>
        </div>
        
        <Alert variant="warning" className="mt-4 mb-0">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Important:</strong> Save your QR code or secret key in a safe place. You'll need it to set up MFA on other devices.
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default MFASetup;

