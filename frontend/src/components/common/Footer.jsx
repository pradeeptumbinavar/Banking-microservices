import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 border-top" style={{ borderColor: 'var(--border)' }}>
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="text-muted">© {new Date().getFullYear()} Banking Portal</div>
        <nav className="d-flex gap-4">
          <a className="text-muted hover-grow" href="mailto:contact@bank.local">Contact</a>
          <a className="text-muted hover-grow" href="#privacy">Privacy</a>
          <a className="text-muted hover-grow" href="#terms">Terms</a>
        </nav>
      </Container>
    </footer>
  );
}


