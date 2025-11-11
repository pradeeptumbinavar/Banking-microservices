import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Table, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/apiEndpoints';

const CurrencyTotal = ({ totals }) => {
  // totals: { [currency]: sum }
  const entries = Object.entries(totals || {});
  if (entries.length === 0) return <span className="text-muted">0</span>;
  return (
    <div className="d-flex align-items-center" style={{ gap: 8, flexWrap: 'wrap' }}>
      {entries.map(([cur, amt]) => (
        <Badge key={cur} bg="secondary">
          {cur}: {Number(amt).toLocaleString()}
        </Badge>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, hint, icon, accent = 'primary', children }) => {
  const iconBg = {
    primary: 'color-mix(in srgb, var(--primary) 35%, transparent)',
    success: 'color-mix(in srgb, var(--success) 35%, transparent)',
    info: 'color-mix(in srgb, var(--info) 35%, transparent)',
    warning: 'color-mix(in srgb, var(--warning) 35%, transparent)'
  }[accent] || 'color-mix(in srgb, var(--primary) 35%, transparent)';

  return (
    <Card className="mb-3 glass border-0 h-100">
      <Card.Body className="p-4" style={{ color: '#fff', minHeight: 180 }}>
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 800 }}>{title}</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', lineHeight: 1.05 }}>{value}</div>
            {hint && <div style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{hint}</div>}
            {children && <div className="mt-2">{children}</div>}
          </div>
          <div className="d-flex align-items-start gap-2 ms-2">
            {icon && (
              <span className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: 44, height: 44, background: iconBg, color: 'var(--heading-icon-color)' }}>
                <i className={`bi ${icon}`} />
              </span>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const groupCount = (arr, key) => {
  const map = {};
  (arr || []).forEach((it) => {
    const k = (it?.[key] || 'UNKNOWN');
    map[k] = (map[k] || 0) + 1;
  });
  return map;
};

const sumBy = (arr, key) => {
  return (arr || []).reduce((acc, it) => acc + (Number(it?.[key]) || 0), 0);
};

const sumByCurrency = (arr, amountKey = 'amount', currencyKey = 'currency') => {
  const map = {};
  (arr || []).forEach((it) => {
    const cur = it?.[currencyKey] || 'USD';
    const val = Number(it?.[amountKey]) || 0;
    map[cur] = (map[cur] || 0) + val;
  });
  return map;
};

const AdminInsights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [credits, setCredits] = useState([]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cRes, aRes, pRes, crRes] = await Promise.all([
        api.get(API_ENDPOINTS.ADMIN.CUSTOMERS_ALL),
        api.get(API_ENDPOINTS.ADMIN.ACCOUNTS_ALL),
        api.get(API_ENDPOINTS.ADMIN.PAYMENTS_ALL),
        api.get(API_ENDPOINTS.ADMIN.CREDITS_ALL),
      ]);
      setCustomers(cRes.data || []);
      setAccounts(aRes.data || []);
      setPayments(pRes.data || []);
      setCredits(crRes.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const metrics = useMemo(() => {
    // Customers
    const customerCount = customers.length;
    const kycByStatus = groupCount(customers, 'kycStatus');

    // Accounts
    const accountCount = accounts.length;
    const accountsByType = groupCount(accounts, 'accountType');
    const accountsByStatus = groupCount(accounts, 'status');
    const totalBalances = sumBy(accounts, 'balance');

    // Payments
    const paymentCount = payments.length;
    const paymentsByStatus = groupCount(payments, 'status');
    const paymentsTotals = sumByCurrency(payments, 'amount', 'currency');

    // Credits
    const creditCount = credits.length;
    const creditsByType = groupCount(credits, 'productType');
    const creditsByStatus = groupCount(credits, 'status');
    const loanAmount = sumBy(credits.filter(c => (c.productType || '').toUpperCase().includes('LOAN')), 'amount');
    const cardLimits = sumBy(credits.filter(c => (c.productType || '').toUpperCase().includes('CARD')), 'creditLimit');

    return {
      customerCount, kycByStatus,
      accountCount, accountsByType, accountsByStatus, totalBalances,
      paymentCount, paymentsByStatus, paymentsTotals,
      creditCount, creditsByType, creditsByStatus, loanAmount, cardLimits,
    };
  }, [customers, accounts, payments, credits]);

  return (
    <Container className="py-4">
      <div className="section-heading">
        <span className="section-heading__icon"><i className="bi bi-graph-up-arrow" /></span>
        <h2 className="section-heading__title m-0">Admin Insights</h2>
        <div className="ms-auto d-flex align-items-center gap-2">
          {loading && <Spinner size="sm" />}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={refresh} disabled={loading}>
            <i className="bi bi-arrow-repeat me-1" /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <Card className="mb-3"><Card.Body className="text-danger">{error}</Card.Body></Card>
      )}

      {/* Top-level KPIs */}
      <Row>
        <Col md={3} sm={6} xs={12}>
          <StatCard title="Total Customers" value={metrics.customerCount} icon="bi-people" accent="info" />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard title="Total Accounts" value={metrics.accountCount} hint={`Balances: ${metrics.totalBalances.toLocaleString()}`} icon="bi-wallet2" accent="primary" />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard title="Total Payments" value={metrics.paymentCount} icon="bi-arrow-left-right" accent="success">
            <CurrencyTotal totals={metrics.paymentsTotals} />
          </StatCard>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard title="Credit Products" value={metrics.creditCount} hint={`Loans: ${metrics.loanAmount.toLocaleString()} | Limits: ${metrics.cardLimits.toLocaleString()}`} icon="bi-credit-card" accent="warning" />
        </Col>
      </Row>

      {/* Breakdowns */}
      <Row className="mt-3">
        <Col md={6}>
          <Card className="mb-3 glass border-0" style={{ color: '#fff' }}>
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="bi bi-shield-check" /> Customers by KYC Status
            </Card.Header>
            <Table hover responsive className="mb-0">
              <thead><tr><th>Status</th><th className="text-end">Count</th></tr></thead>
              <tbody>
                {Object.entries(metrics.kycByStatus || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td className="text-end"><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{v}</span></td></tr>
                ))}
                {Object.keys(metrics.kycByStatus || {}).length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 glass border-0" style={{ color: '#fff' }}>
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="bi bi-hdd-network" /> Accounts by Type
            </Card.Header>
            <Table hover responsive className="mb-0">
              <thead><tr><th>Type</th><th className="text-end">Count</th></tr></thead>
              <tbody>
                {Object.entries(metrics.accountsByType || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td className="text-end"><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{v}</span></td></tr>
                ))}
                {Object.keys(metrics.accountsByType || {}).length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-3 glass border-0" style={{ color: '#fff' }}>
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="bi bi-activity" /> Accounts by Status
            </Card.Header>
            <Table hover responsive className="mb-0">
              <thead><tr><th>Status</th><th className="text-end">Count</th></tr></thead>
              <tbody>
                {Object.entries(metrics.accountsByStatus || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td className="text-end"><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{v}</span></td></tr>
                ))}
                {Object.keys(metrics.accountsByStatus || {}).length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 glass border-0" style={{ color: '#fff' }}>
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="bi bi-cash-coin" /> Payments by Status
            </Card.Header>
            <Table hover responsive className="mb-0">
              <thead><tr><th>Status</th><th className="text-end">Count</th></tr></thead>
              <tbody>
                {Object.entries(metrics.paymentsByStatus || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td className="text-end"><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{v}</span></td></tr>
                ))}
                {Object.keys(metrics.paymentsByStatus || {}).length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-3 glass border-0" style={{ color: '#fff' }}>
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="bi bi-columns-gap" /> Credits by Type
            </Card.Header>
            <Table hover responsive className="mb-0">
              <thead><tr><th>Type</th><th className="text-end">Count</th></tr></thead>
              <tbody>
                {Object.entries(metrics.creditsByType || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td className="text-end"><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{v}</span></td></tr>
                ))}
                {Object.keys(metrics.creditsByType || {}).length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3 glass border-0" style={{ color: '#fff' }}>
            <Card.Header className="bg-transparent border-0 d-flex align-items-center gap-2" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900 }}>
              <i className="bi bi-clipboard2-check" /> Credits by Status
            </Card.Header>
            <Table hover responsive className="mb-0">
              <thead><tr><th>Status</th><th className="text-end">Count</th></tr></thead>
              <tbody>
                {Object.entries(metrics.creditsByStatus || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td className="text-end"><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{v}</span></td></tr>
                ))}
                {Object.keys(metrics.creditsByStatus || {}).length === 0 && <tr><td colSpan={2} className="text-muted">No data</td></tr>}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminInsights;
