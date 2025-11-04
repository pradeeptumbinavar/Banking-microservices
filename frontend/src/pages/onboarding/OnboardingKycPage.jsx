import React, { useMemo, useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { KycDocumentTypeOptions, KycDocumentType, KycDocumentPlaceholders, KycDocumentRegex } from '../../constants/enums';

const OnboardingKycPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const resubmit = params.get('resubmit') === '1';
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    documentType: KycDocumentType.AADHAAR,
    documentNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const placeholder = useMemo(() => KycDocumentPlaceholders[formData.documentType], [formData.documentType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'documentType') {
      v = value;
    }
    if (name === 'documentNumber') {
      if (formData.documentType === KycDocumentType.PAN) {
        v = v.toUpperCase();
      }
    }
    setFormData({ ...formData, [name]: v });
  };

  const validate = () => {
    const regex = KycDocumentRegex[formData.documentType];
    if (!regex.test(formData.documentNumber)) {
      if (formData.documentType === KycDocumentType.AADHAAR) {
        return 'Enter a valid Aadhaar number (e.g., 1234 5678 9012)';
      }
      return 'Enter a valid PAN (e.g., ABCDE1234F)';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const res = await fetch(`/customers/${user?.customerId}/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          documentType: formData.documentType,
          documentNumber: formData.documentNumber
        })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Failed to submit KYC');
      }
      updateUser({ kycStatus: 'PENDING' });
      navigate('/kyc-pending');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <Card className="mx-auto glass-form-card glass-nav border-0" style={{ maxWidth: 720 }}>
        <Card.Header className="pb-0">
          <h2 className="fw-bold mb-2">Verify your identity</h2>
          <p className="mb-0">Submit your KYC details to activate your account</p>
        </Card.Header>
        <Card.Body className="p-4 p-md-5 pt-4">
          {resubmit && (
            <Alert variant="warning">Your previous KYC was rejected. Please resubmit with correct details.</Alert>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Select name="documentType" value={formData.documentType} onChange={handleChange}>
                  {KycDocumentTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Document Number</Form.Label>
                <Form.Control
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                />
                <Form.Text className="text-muted">
                  {formData.documentType === KycDocumentType.AADHAAR ? 'Format: 1234 5678 9012' : 'Format: ABCDE1234F'}
                </Form.Text>
              </Col>
            </Row>
            <Button type="submit" disabled={loading} className="w-100">
              {loading ? 'Submitting...' : 'Submit KYC'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OnboardingKycPage;


