import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const FeatureCard = ({ icon, title, text }) => (
  <Card className="p-3 hover-lift" style={{ minWidth: 280 }}>
    <div className="d-flex align-items-center gap-3 mb-2">
      <i className={`bi ${icon}`} style={{ fontSize: 24, color: 'var(--primary)' }} />
      <h5 className="mb-0">{title}</h5>
    </div>
    <p className="text-muted mb-0">{text}</p>
  </Card>
);

const FeaturePanel = ({ src, title, text, color }) => (
  <Card className="glass-nav border-0 p-4" style={{ borderRadius: '1rem' }}>
    <div className="mb-3 d-flex justify-content-center" style={{ height: 200 }}>
      <DotLottieReact src={src} loop autoplay style={{ width: '100%', height: '100%' }} />
    </div>
    <h4 className="text-center mb-2" style={{ color: color }}>{title}</h4>
    <p className="text-muted text-center mb-0">{text}</p>
  </Card>
);

export default function LandingPage() {
  return (
    <div className="d-flex flex-column min-vh-100 with-bg">
      {/* Hero */}
      <section className="hero py-5 py-lg-6" style={{ paddingTop: '2rem' }}>
        <Container>
          <div className="hero-card">
            <div className="hero-card__content fade-in">
              <span className="hero-card__kicker">Modern digital banking</span>
              <h1 className="hero-card__headline mb-2">
                Banking that feels <span>safe</span> & <span>simple.</span>
              </h1>
              <p className="hero-card__support mb-0">
                Secure accounts, instant transfers, clear insights—built on reliable microservices and safeguarded with enterprise-grade security.
              </p>
              <div className="hero-card__actions">
                <Button as={Link} to="/login" size="lg" variant="primary" className="hover-grow px-4">
                  Login
                </Button>
                <Button as={Link} to="/register" size="lg" variant="outline-light" className="hover-grow px-4">
                  Create account
                </Button>
              </div>
            </div>
            <div className="hero-card__visual">
              <DotLottieReact
                src="https://lottie.host/9ad443f3-1c57-45e1-8e3e-fb3761c46a6f/yeakngZIDS.lottie"
                loop
                autoplay
                className="hero-card__lottie"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center text-center mb-4">
            <Col md={9}>
              <h2 className="mb-3" style={{ color: 'var(--heading-color)' }}>About us</h2>
              <p className="text-muted">We are a modern banking platform focused on transparency, speed, and security—so your money moves when you do.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features — vertical panels with Lottie */}
      <section className="py-5">
        <Container>
          <div className="mx-auto d-flex flex-column gap-4" style={{ maxWidth: '760px' }}>
            <FeaturePanel
              src="https://lottie.host/3b7e18fa-db21-401a-b0c4-71cea2f3a334/QhTpTIBkgb.lottie"
              color={'var(--primary)'}
              title="Secure by design"
              text="JWT, KYC, approvals, and granular roles."
            />
            <FeaturePanel
              src="https://lottie.host/830b3108-4614-4e28-b5c3-4b674211b9ed/ApgVS1vVUj.lottie"
              color={'var(--accent-2)'}
              title="Fast transfers"
              text="Internal transfers with clear statuses."
            />
            <FeaturePanel
              src="https://lottie.host/123c569d-0606-4115-a38c-92700f42f76d/GIp2HNlg0r.lottie"
              color={'var(--accent-1)'}
              title="Clean UI"
              text="Beautiful, modern interface that stays out of your way."
            />
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}


