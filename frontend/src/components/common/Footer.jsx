import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  const linkStyle = {
    color: 'color-mix(in srgb, var(--heading-color) 90%, transparent)',
    textDecoration: 'none'
  };
  const sepStyle = { color: 'color-mix(in srgb, var(--heading-color) 65%, transparent)' };
  const iconStyle = { color: '#F0B400', fontSize: 24 };

  return (
    <footer className="mt-auto py-4 border-top" style={{ borderColor: 'var(--border)' }}>
      <Container>
        {/* Policy links */}
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-3">
          <a className="hover-grow" style={linkStyle} href="#privacy-policy">Privacy Policy</a>
          <span style={sepStyle}>|</span>
          <a className="hover-grow" style={linkStyle} href="#disclaimer">Disclaimer</a>
          <span style={sepStyle}>|</span>
          <a className="hover-grow" style={linkStyle} href="#cookie-policy">Cookie Policy</a>
        </div>

        {/* Social icons */}
        <div className="d-flex justify-content-center align-items-center gap-4">
          <a aria-label="Facebook" className="hover-grow" style={iconStyle} href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook" />
          </a>
          <a aria-label="X" className="hover-grow" style={iconStyle} href="https://x.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-twitter-x" />
          </a>
          <a aria-label="Instagram" className="hover-grow" style={iconStyle} href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram" />
          </a>
          <a aria-label="LinkedIn" className="hover-grow" style={iconStyle} href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-linkedin" />
          </a>
          <a aria-label="YouTube" className="hover-grow" style={iconStyle} href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-youtube" />
          </a>
        </div>

        {/* Small brand copy */}
        <div className="mt-3 text-center" style={{ color: 'color-mix(in srgb, var(--heading-color) 70%, transparent)' }}>
          © {new Date().getFullYear()} Banking Portal
        </div>
      </Container>
    </footer>
  );
}

