import React, { useState, useRef, useEffect } from 'react';
import { Form, Alert } from 'react-bootstrap';

const MFAInput = ({ onCodeComplete, error }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last character
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call callback when all 6 digits entered
    if (newCode.every(digit => digit !== '') && index === 5) {
      onCodeComplete(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setCode(newCode);

    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // If complete, call callback
    if (pastedData.length === 6) {
      onCodeComplete(pastedData);
    }
  };

  return (
    <div>
      <Form.Label className="fw-semibold mb-3" style={{ fontSize: '1rem', color: 'var(--gray-700)' }}>
        Enter 6-Digit MFA Code
      </Form.Label>
      
      <Alert variant="info" className="mb-4" style={{ borderRadius: '0.75rem' }}>
        <i className="bi bi-phone me-2"></i>
        Open your authenticator app and enter the 6-digit code
      </Alert>

      <div className="d-flex justify-content-center gap-2 mb-4">
        {code.map((digit, index) => (
          <Form.Control
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            style={{
              width: '60px',
              height: '70px',
              fontSize: '2rem',
              textAlign: 'center',
              fontWeight: 'bold',
              borderRadius: '0.75rem',
              border: `2px solid ${error ? 'var(--danger-color)' : 'var(--gray-200)'}`,
              transition: 'all 0.2s'
            }}
            className="mfa-input"
          />
        ))}
      </div>

      {error && (
        <Alert variant="danger" className="mb-0" style={{ borderRadius: '0.75rem' }}>
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      <style jsx>{`
        .mfa-input:focus {
          border-color: var(--primary-color) !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default MFAInput;

