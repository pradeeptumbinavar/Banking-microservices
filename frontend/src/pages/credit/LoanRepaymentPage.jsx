import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { creditService } from '../../services/creditService';
import { accountService } from '../../services/accountService';
import { paymentService } from '../../services/paymentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

function computeEmi(principal, annualRate, termMonths) {
  const P = Number(principal) || 0;
  const n = Number(termMonths) || 0;
  const r = (Number(annualRate) || 0) / 1200; // monthly rate
  if (P <= 0 || n <= 0) return 0;
  if (r === 0) return +(P / n).toFixed(2);
  const pow = Math.pow(1 + r, n);
  const emi = (P * r * pow) / (pow - 1);
  return +emi.toFixed(2);
}

const LoanRepaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loan, setLoan] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Try direct fetch by ID first
        let loanData = null;
        try {
          loanData = await creditService.getCreditProductById(id);
        } catch (_) {
          loanData = null;
        }

        // Fallback: fetch user's credits and locate by id (helps if backend route restricts direct get)
        if (!loanData) {
          const lookupId = user?.customerId || user?.id;
          const list = await creditService.getCreditProductsByUserId(lookupId).catch(() => []);
          if (Array.isArray(list)) {
            loanData = list.find(x => String(x.id) === String(id)) || null;
          }
        }

        if (!loanData) {
          throw new Error('Loan not found');
        }
        setLoan(loanData);

        // Load ACTIVE accounts for payment
        const lookupId = user?.customerId || user?.id;
        const accs = await accountService.getAccountsByUserId(lookupId, 'ACTIVE');
        setAccounts(Array.isArray(accs) ? accs : []);
      } catch (e) {
        toast.error(e.response?.data?.message || e.message || 'Failed to load loan');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user?.customerId, user?.id]);

  const emi = useMemo(() => computeEmi(loan?.amount, loan?.interestRate, loan?.termMonths), [loan]);
  const monthlyRate = (Number(loan?.interestRate) || 0) / 1200;
  const thisMonthInterest = useMemo(() => +(((Number(loan?.amount) || 0) * monthlyRate) || 0).toFixed(2), [loan, monthlyRate]);
  const thisMonthPrincipal = useMemo(() => +(Math.max(0, emi - thisMonthInterest)).toFixed(2), [emi, thisMonthInterest]);

  const activeAccountOptions = useMemo(() => (
    accounts.map(a => (
      <option key={a.id} value={a.id}>
        {a.accountNumber} - {a.accountType} - {a.currency} - {a.balance}
      </option>
    ))
  ), [accounts]);

  async function handlePay(e) {
    e.preventDefault();
    if (!loan || !accountId) return;
    if (!(loan.status === 'APPROVED' || loan.status === 'ACTIVE')) {
      toast.info('Loan not approved yet. Please wait for approval.');
      return;
    }

    const payAmount = emi;
    if (payAmount <= 0) { toast.error('Invalid EMI amount'); return; }
    setSubmitting(true);
    try {
      const acc = await accountService.getAccountById(accountId);
      const currentBalance = Number(acc.balance) || 0;
      if (currentBalance < payAmount) throw new Error('Insufficient balance');

      // 1) Deduct from selected account
      await accountService.updateAccount(accountId, { balance: +(currentBalance - payAmount).toFixed(2) });

      // 2) Record a transaction for visibility
      await paymentService.createTransfer({
        fromAccountId: Number(accountId),
        toAccountId: 0,
        amount: payAmount,
        currency: acc.currency || 'USD',
        description: `Loan repayment for credit ${loan.id}`,
        transferType: 'LOAN_REPAYMENT'
      });

      // 3) Update credit product (reduce principal by principal component)
      const remaining = Math.max(0, (Number(loan.amount) || 0) - thisMonthPrincipal);
      const nextStatus = remaining <= 0 ? 'CLOSED' : (loan.status === 'APPROVED' ? 'ACTIVE' : loan.status);
      const updated = await creditService.updateCreditProduct(loan.id, { amount: +remaining.toFixed(2), status: nextStatus });
      setLoan(updated || { ...loan, amount: remaining, status: nextStatus });

      toast.success('EMI paid successfully');
      navigate('/transactions');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner text="Loading loan..." />;
  if (!loan) return (
    <Container className="py-4"><Alert variant="warning">Loan not found</Alert></Container>
  );

  const isPending = !(loan.status === 'APPROVED' || loan.status === 'ACTIVE');
  const isClosedOrZero = (Number(loan.amount) || 0) <= 0 || loan.status === 'CLOSED';

  return (
    <Container className="py-4">
      <div className="section-heading">
        <span className="section-heading__icon">
          <i className="bi bi-credit-card" />
        </span>
        <h2 className="section-heading__title">Loan Repayment</h2>
      </div>

      <Card className="glass-nav border-0">
        <Card.Body>
          <Row className="g-4">
            <Col md={6}>
              <div className="mb-3">
                <div style={{ color: 'var(--muted)' }}>Loan ID</div>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>{loan.id}</div>
              </div>
              <div className="mb-3">
                <div style={{ color: 'var(--muted)' }}>Principal</div>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>{Number(loan.amount).toLocaleString()}</div>
              </div>
              <div className="mb-3">
                <div style={{ color: 'var(--muted)' }}>Interest Rate</div>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>{loan.interestRate}%</div>
              </div>
              <div className="mb-3">
                <div style={{ color: 'var(--muted)' }}>Term</div>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>{loan.termMonths} months</div>
              </div>
              <div className="mb-3">
                <div style={{ color: 'var(--muted)' }}>Status</div>
                <div style={{ color: 'var(--text)', fontWeight: 600 }}>{loan.status}</div>
              </div>
            </Col>
            <Col md={6}>
              <Card className="glass-nav border-0">
                <Card.Body>
                  <h5 className="mb-3" style={{ color: 'var(--text)' }}>EMI Summary</h5>
                  <div className="mb-2" style={{ color: 'var(--text)' }}>Monthly EMI: <strong>{emi.toLocaleString()}</strong></div>
                  <div className="mb-2" style={{ color: 'var(--text)' }}>This month interest: <strong>{thisMonthInterest.toLocaleString()}</strong></div>
                  <div className="mb-2" style={{ color: 'var(--text)' }}>This month principal: <strong>{thisMonthPrincipal.toLocaleString()}</strong></div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <hr />

          {isPending ? (
            <Alert variant="warning" className="mb-0">Loan is pending approval. Please wait before making repayments.</Alert>
          ) : isClosedOrZero ? (
            <Alert variant="success" className="mb-0">Loan is fully repaid.</Alert>
          ) : (
            <Form onSubmit={handlePay}>
              <Row className="g-3 align-items-end">
                <Col md={6}>
                  <Form.Label className="fw-semibold" style={{ color: 'color-mix(in srgb, var(--text) 88%, transparent)' }}>Pay From Account</Form.Label>
                  <Form.Select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
                    <option value="">Select account...</option>
                    {activeAccountOptions}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="fw-semibold" style={{ color: 'color-mix(in srgb, var(--text) 88%, transparent)' }}>Amount</Form.Label>
                  <Form.Control type="number" value={emi} readOnly />
                </Col>
                <Col md={3}>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Processing...' : 'Pay EMI'}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoanRepaymentPage;
