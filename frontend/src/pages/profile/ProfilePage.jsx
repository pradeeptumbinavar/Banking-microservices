import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    const bootstrap = async () => {
      if (!user) return;
      setForm((f) => ({ ...f, username: user.username || '', email: user.email || '' }));
      try {
        const profile = await authService.getCustomerByUserId(user.id, user.email);
        if (profile) {
          setCustomer(profile);
          setForm((f) => ({
            ...f,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            address: profile.address || ''
          }));
        }
      } catch (_) { /* ignore */ }
    };
    bootstrap();
  }, [user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Update customer profile (first/last/phone/address,email)
      if (customer?.id) {
        await authService.updateCustomer(customer.id, {
          firstName: form.firstName || null,
          lastName: form.lastName || null,
          email: form.email || user.email,
          phone: form.phone || null,
          address: form.address || null,
        });
      }

      // Update user (email, optional username/password)
      const userPayload = { email: form.email };
      if (form.username && form.username !== user.username) userPayload.username = form.username; // backend may accept
      if (form.password) userPayload.password = form.password; // optional, if backend supports
      await authService.updateUser(user.id, userPayload);

      updateUser({ username: form.username || user.username, email: form.email });
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="section-heading">
        <span className="section-heading__icon">
          <i className="bi bi-person-circle" />
        </span>
        <h2 className="section-heading__title">Profile</h2>
      </div>
      <Card className="glass-nav border-0">
        <Card.Body>
          <Row className="g-4">
            <Col md={4} className="text-center">
              <Image src={require('../../assets/images/profile.png')} onError={(e)=>{ e.currentTarget.style.display='none'; }} roundedCircle alt="Profile" style={{ width: 140, height: 140, objectFit: 'cover', border: '1px solid var(--border)' }} />
              <div className="mt-3 text-muted" style={{ fontSize: '0.9rem' }}>{user?.role}</div>
            </Col>
            <Col md={8}>
              <Form onSubmit={onSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Username</Form.Label>
                    <Form.Control name="username" value={form.username} onChange={onChange} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={onChange} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">First name</Form.Label>
                    <Form.Control name="firstName" value={form.firstName} onChange={onChange} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Last name</Form.Label>
                    <Form.Control name="lastName" value={form.lastName} onChange={onChange} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Phone</Form.Label>
                    <Form.Control name="phone" value={form.phone} onChange={onChange} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Address</Form.Label>
                    <Form.Control name="address" value={form.address} onChange={onChange} style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">New password</Form.Label>
                    <Form.Control type="password" name="password" value={form.password} onChange={onChange} placeholder="Leave blank to keep" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text)' }} />
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button type="submit" variant="primary" disabled={loading} className="fw-semibold">
                    {loading ? 'Saving...' : 'Save changes'}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;

