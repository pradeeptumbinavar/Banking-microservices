import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="mt-auto py-4 border-top" style={{ borderColor: 'var(--border)' }}>
      <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div style={{ color: 'var(--heading-color)' }}>© {new Date().getFullYear()} Banking Portal</div>
        <nav className="d-flex gap-4">
          <a className="hover-grow" style={{ color: 'color-mix(in srgb, var(--heading-color) 75%, transparent)' }} href="mailto:contact@bank.local">Contact</a>
          <a className="hover-grow" style={{ color: 'color-mix(in srgb, var(--heading-color) 75%, transparent)' }} href="#privacy">Privacy</a>
          <a className="hover-grow" style={{ color: 'color-mix(in srgb, var(--heading-color) 75%, transparent)' }} href="#terms">Terms</a>
        </nav>
      </Container>
    </footer>
  );
}

