import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Image, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import customersImg from '../../assets/images/hero-customers.png';
import loansImg from '../../assets/images/hero-loans.png';
import cardsImg from '../../assets/images/hero-cards.png';
import secureImg from '../../assets/images/hero-secure.png';
import satisfiedCustomersFull from '../../assets/images/satisfied customers.png';
import loanCard1 from '../../assets/images/loan card 1.png';
import loanCard2 from '../../assets/images/loan card 2.png';
import loanCard3 from '../../assets/images/loan card 3.png';

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
  // Carousel slides (loan images)
  const loanSlides = [
    {
      img: loanCard1,
      title: 'Home Loans — set down roots',
      desc: 'Low rates and flexible tenure for your dream home. Introductory processing fee waiver for approved KYC.'
    },
    {
      img: loanCard2,
      title: 'Vehicle Loans — drive your dream',
      desc: 'Quick approvals for new or used vehicles with clear monthly repayments and simple documentation.'
    },
    {
      img: loanCard3,
      title: 'Education Loans — invest in learning',
      desc: 'Cover tuition and living costs with friendly repayment options and zero prepayment charges during offers.'
    }
  ];

  // Typing animation for heading: vehicle / education / home
  const words = ['VEHICLES', 'EDUCATION', 'HOME'];
  const [wIdx, setWIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wIdx];
    // Slower typing/deleting and small pauses at word boundaries
    let delay = deleting ? 120 : 180; // ms per step
    if (!deleting && chars === current.length) delay = 1200; // pause when word complete
    if (deleting && chars === 0) delay = 700; // brief pause before next word

    const timer = setTimeout(() => {
      if (!deleting) {
        if (chars < current.length) {
          setChars(chars + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (chars > 0) {
          setChars(chars - 1);
        } else {
          setDeleting(false);
          setWIdx((wIdx + 1) % words.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [chars, deleting, wIdx]);

  const typed = words[wIdx].substring(0, chars);
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

      {/* Loans carousel (moved just after hero) */}
      <section className="py-4" style={{ marginBottom: '2rem' }}>
        <Container>
          <div className="text-center mb-3">
            <h3 className="mb-0" style={{ color: 'var(--heading-color)' }}>
              Exciting loans for{' '}
              <span style={{ color: 'var(--primary)' }}>{typed}</span>
              <span className="ms-1" style={{ color: 'var(--primary)' }}>|</span>
            </h3>
          </div>
          {/* Local styles to slim down the dark control overlays */}
          <style>{`
            .landing-carousel .carousel-control-prev, 
            .landing-carousel .carousel-control-next { 
              width: 8%; 
              background: transparent; 
            }
            .landing-carousel .carousel-control-prev:hover, 
            .landing-carousel .carousel-control-next:hover { 
              background: rgba(0,0,0,0.18); 
            }
          `}</style>
          <Carousel className="landing-carousel" fade interval={2000} indicators controls>
            {loanSlides.map((s, idx) => (
              <Carousel.Item key={idx}>
                <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden' }}>
                  <img
                    src={s.img}
                    alt={s.title}
                    style={{ width: '100%', height: '60vh', objectFit: 'cover', objectPosition: 'center 30%' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: '16px',
                      transform: 'translateX(-50%)',
                      width: '94%',
                      maxWidth: '1200px',
                      color: '#fff',
                      background: 'rgba(2, 6, 23, 0.45)',
                      padding: '16px 24px',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)'
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.title}</div>
                    <div style={{ fontSize: '0.95rem', opacity: 0.95 }}>{s.desc}</div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Full-bleed image just after hero */}
      <section className="py-0" style={{ marginBottom: '2rem' }}>
        <Container fluid className="p-0">
          <div style={{ position: 'relative' }}>
            <img
              src={satisfiedCustomersFull}
              alt="Satisfied customers banner"
              style={{ width: '100%', height: '100vh', objectFit: 'cover', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '32px',
                transform: 'translateX(-50%)',
                color: '#fff',
                background: 'rgba(2, 6, 23, 0.45)',
                padding: '16px 32px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                textAlign: 'center',
                pointerEvents: 'none',
                width: '90%',
                maxWidth: '1200px'
              }}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>Satisfied customers worldwide</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Modern, secure, and effortless digital banking</div>
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

      {/* Features – vertical panels with Lottie */}
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


      {/* Loans carousel moved above; section removed here */}

      <Footer />
    </div>
  );
}


