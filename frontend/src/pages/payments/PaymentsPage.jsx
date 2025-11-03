import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Tabs, Tab, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { accountService } from '../../services/accountService';
import { deposit as flowDeposit, selfTransfer as flowSelfTransfer, bankTransferExisting, bankTransferExternal } from '../../services/paymentsFlow';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { customerService } from '../../services/customerService';

function AmountInput({ value, onChange }) {
  return (
    <Form.Control
      type="number"
      step="0.01"
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="0.00"
      required
    />
  );
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  // Deposit
  const [depAccountId, setDepAccountId] = useState('');
  const [depAmount, setDepAmount] = useState('');

  // Self transfer
  const [selfFromId, setSelfFromId] = useState('');
  const [selfToId, setSelfToId] = useState('');
  const [selfAmount, setSelfAmount] = useState('');

  // Bank transfer
  const [mode, setMode] = useState('existing'); // existing | external
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [recipientAccounts, setRecipientAccounts] = useState([]);
  const [bankFromId, setBankFromId] = useState('');
  const [bankToId, setBankToId] = useState('');
  const [bankAmount, setBankAmount] = useState('');
  const [extBankName, setExtBankName] = useState('');
  const [extIfsc, setExtIfsc] = useState('');
  const [extAccountNumber, setExtAccountNumber] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const lookupId = user?.customerId || user?.id;
        if (lookupId) {
          const data = await accountService.getAccountsByUserId(lookupId);
          setAccounts(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        toast.error('Failed to load accounts');
      }
    };
    load();
  }, [user?.customerId, user?.id]);

  // Helpers
  const findAccount = (id) => accounts.find(a => String(a.id) === String(id));

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depAccountId || !depAmount) return;
    const amount = parseFloat(depAmount);
    if (amount <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      await flowDeposit({ accountId: depAccountId, amount });
      toast.success('Deposit successful');
      setDepAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelfTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(selfAmount);
    if (!selfFromId || !selfToId || selfFromId === selfToId) return toast.error('Select two different accounts');
    if (amount <= 0) return toast.error('Enter a valid amount');
    setLoading(true);
    try {
      await flowSelfTransfer({ fromId: selfFromId, toId: selfToId, amount });
      toast.success('Transfer successful');
      setSelfAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  // BANK TRANSFER: fetch list of KYC ACTIVE customers
  useEffect(() => {
    async function loadCustomers() {
      try {
        const kycCustomers = await customerService.getKycActiveCustomers();
        setCustomers(Array.isArray(kycCustomers) ? kycCustomers : []);
      } catch (e) {
        setCustomers([]);
      }
    }
    loadCustomers();
  }, []);

  // BANK TRANSFER: fetch recipient's ACTIVE accounts
  useEffect(() => {
    async function loadRecipientAccounts() {
      if (!selectedCustomerId) { 
        setRecipientAccounts([]); 
        setBankToId(''); // Clear selected account when customer changes
        return; 
      }
      try {
        // Use customer ID directly (matches customerId in Account entity)
        const activeAccounts = await accountService.getAccountsByUserId(selectedCustomerId, 'ACTIVE');
        setRecipientAccounts(Array.isArray(activeAccounts) ? activeAccounts : []);
        if (activeAccounts.length === 0) {
          toast.info('No active accounts found for selected customer');
        }
      } catch (e) {
        console.error('Failed to load recipient accounts:', e);
        setRecipientAccounts([]);
        toast.error('Failed to load recipient accounts');
      }
    }
    loadRecipientAccounts();
  }, [selectedCustomerId]);

  const handleBankTransfer = async (e) => {
    e.preventDefault();
    const amount = parseFloat(bankAmount);
    if (!bankFromId || amount <= 0) return toast.error('Enter required fields');
    if (mode === 'existing' && !bankToId) return toast.error('Please select a recipient account');
    setLoading(true);
    try {
      if (mode === 'existing' && bankToId) {
        await bankTransferExisting({ fromId: bankFromId, toId: bankToId, amount, descriptionPrefix: `Bank transfer to customer ${selectedCustomerId}` });
        // Refresh accounts to show updated balances
        const lookupId = user?.customerId || user?.id;
        if (lookupId) {
          const refreshed = await accountService.getAccountsByUserId(lookupId);
          setAccounts(Array.isArray(refreshed) ? refreshed : []);
        }
      } else {
        await bankTransferExternal({ fromId: bankFromId, amount, bankName: extBankName, ifsc: extIfsc, accountNumber: extAccountNumber });
        // Refresh accounts to show updated balances
        const lookupId = user?.customerId || user?.id;
        if (lookupId) {
          const refreshed = await accountService.getAccountsByUserId(lookupId);
          setAccounts(Array.isArray(refreshed) ? refreshed : []);
        }
      }

      toast.success('Payment successful! Transaction recorded.');
      // Reset form
      setBankAmount('');
      setBankToId('');
      setExtBankName('');
      setExtIfsc('');
      setExtAccountNumber('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const accountOptions = useMemo(() => (
    accounts.map(a => <option key={a.id} value={a.id}>{a.accountNumber} · {a.accountType} · {a.currency} · {a.balance}</option>)
  ), [accounts]);

  return (
    <Container className="py-4">
      <Card className="glass-nav border-0">
        <Card.Body>
          <Tabs defaultActiveKey="deposit" className="mb-3">
            <Tab eventKey="deposit" title="Deposit">
              <Form onSubmit={handleDeposit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Account</Form.Label>
                    <Form.Select value={depAccountId} onChange={e => setDepAccountId(e.target.value)} required>
                      <option value="">Select account...</option>
                      {accountOptions}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Amount</Form.Label>
                    <AmountInput value={depAmount} onChange={setDepAmount} />
                  </Col>
                </Row>
                <div className="mt-4">
                  <Button type="submit" variant="primary" disabled={loading}>{loading ? <Spinner size="sm" /> : 'Deposit'}</Button>
                </div>
              </Form>
            </Tab>

            <Tab eventKey="self" title="Self Transfer">
              <Form onSubmit={handleSelfTransfer}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">From</Form.Label>
                    <Form.Select value={selfFromId} onChange={e => setSelfFromId(e.target.value)} required>
                      <option value="">Select account...</option>
                      {accountOptions}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">To</Form.Label>
                    <Form.Select value={selfToId} onChange={e => setSelfToId(e.target.value)} required>
                      <option value="">Select account...</option>
                      {accountOptions}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Amount</Form.Label>
                    <AmountInput value={selfAmount} onChange={setSelfAmount} />
                  </Col>
                </Row>
                <div className="mt-4"><Button type="submit" variant="primary" disabled={loading}>{loading ? <Spinner size="sm" /> : 'Transfer'}</Button></div>
              </Form>
            </Tab>

            <Tab eventKey="bank" title="Bank Transfer">
              <Form onSubmit={handleBankTransfer}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">From</Form.Label>
                    <Form.Select value={bankFromId} onChange={e => setBankFromId(e.target.value)} required>
                      <option value="">Select account...</option>
                      {accountOptions}
                    </Form.Select>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Mode</Form.Label>
                    <Form.Select value={mode} onChange={e => setMode(e.target.value)}>
                      <option value="existing">Existing Customer</option>
                      <option value="external">External Bank</option>
                    </Form.Select>
                  </Col>

                  {mode === 'existing' ? (
                    <>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">Customer</Form.Label>
                        <Form.Select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)}>
                          <option value="">Select customer...</option>
                          {customers.map(c => (
                            <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="fw-semibold">Recipient Account</Form.Label>
                        <Form.Select 
                          value={bankToId} 
                          onChange={e => setBankToId(e.target.value)} 
                          required
                          disabled={!selectedCustomerId || recipientAccounts.length === 0}
                        >
                          <option value="">
                            {!selectedCustomerId ? 'Select customer first...' : recipientAccounts.length === 0 ? 'No active accounts' : 'Select account...'}
                          </option>
                          {recipientAccounts.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.accountNumber} · {a.accountType} · {a.currency} · Balance: {a.balance}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col md={4}>
                        <Form.Label className="fw-semibold">Bank</Form.Label>
                        <Form.Control value={extBankName} onChange={(e)=>setExtBankName(e.target.value)} placeholder="Bank name" />
                      </Col>
                      <Col md={4}>
                        <Form.Label className="fw-semibold">IFSC</Form.Label>
                        <Form.Control value={extIfsc} onChange={(e)=>setExtIfsc(e.target.value)} placeholder="IFSC" />
                      </Col>
                      <Col md={4}>
                        <Form.Label className="fw-semibold">Account Number</Form.Label>
                        <Form.Control value={extAccountNumber} onChange={(e)=>setExtAccountNumber(e.target.value)} placeholder="Account number" />
                      </Col>
                    </>
                  )}

                  <Col md={6}>
                    <Form.Label className="fw-semibold">Amount</Form.Label>
                    <AmountInput value={bankAmount} onChange={setBankAmount} />
                  </Col>
                </Row>
                <div className="mt-4"><Button type="submit" variant="primary" disabled={loading}>{loading ? <Spinner size="sm" /> : 'Pay'}</Button></div>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}


