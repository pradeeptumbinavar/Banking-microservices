import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Container className="py-4">
      <h2 className="mb-4">Profile</h2>
      <Card>
        <Card.Body>
          <h5>User Information</h5>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p className="text-muted">Profile editing coming soon...</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;

