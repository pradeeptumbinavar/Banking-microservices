import React, { useEffect, useState, useMemo } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/paymentService';
import { accountService } from '../../services/accountService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrencyAmount } from '../../utils/currency';
import { toast } from 'react-toastify';

const TransactionsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterTimeRange, setFilterTimeRange] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lookupId = user?.customerId || user?.id;
        const accountsData = await accountService.getAccountsByUserId(lookupId);
        setAccounts(Array.isArray(accountsData) ? accountsData : []);

        const accountIds = accountsData.map(a => a.id);
        if (accountIds.length === 0) {
          setPayments([]);
          setAllPayments([]);
          return;
        }

        const lists = await Promise.all(
          accountIds.map(id => paymentService.getPaymentsByUserId(id).catch(() => []))
        );
        const merged = lists.flat();
        const byId = new Map();
        merged.forEach(p => { if (p?.id != null) byId.set(p.id, p); });
        const unique = Array.from(byId.values()).sort((a, b) => {
          const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        setAllPayments(unique);
        setPayments(unique);
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id, user?.customerId]);

  // Get account number helper
  const getAccountNumber = (accountId) => {
    if (!accountId || accountId === 0) return null;
    const acc = accounts.find(a => a.id === accountId);
    return acc?.accountNumber || `Account ${accountId}`;
  };

  // Parse external transfer description
  const parseExternalTransfer = (description) => {
    if (!description || !description.includes('External bank transfer')) return null;
    // Format: "External bank transfer to {bankName} / IFSC {ifsc} / {accountNumber}"
    const match = description.match(/External bank transfer to (.+?) \/ IFSC (.+?) \/ (.+)/);
    if (match) {
      return { bankName: match[1], ifsc: match[2], accountNumber: match[3] };
    }
    return null;
  };

  // Get transaction type
  const getTransactionType = (payment) => {
    if (payment.toAccountId === 0 || payment.toAccountId === null) {
      return 'External Bank Transfer';
    }
    const desc = payment.description || '';
    if (desc.includes('Deposit') || desc.includes('deposit')) return 'Deposit';
    if (desc.includes('Self transfer') || desc.includes('Self Transfer')) return 'Self Transfer';
    if (desc.includes('Bank transfer') || desc.includes('Bank Transfer')) return 'Bank Transfer';
    return 'Transfer';
  };

  // Apply filters
  const filteredPayments = useMemo(() => {
    let filtered = [...allPayments];

    // Type filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter(p => {
        const type = getTransactionType(p);
        return type === filterType;
      });
    }

    // Status filter
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Time range filter
    if (filterTimeRange !== 'ALL') {
      const now = new Date();
      const cutoff = new Date();
      if (filterTimeRange === '1M') cutoff.setMonth(now.getMonth() - 1);
      else if (filterTimeRange === '3M') cutoff.setMonth(now.getMonth() - 3);
      else if (filterTimeRange === '6M') cutoff.setMonth(now.getMonth() - 6);
      else if (filterTimeRange === '1Y') cutoff.setFullYear(now.getFullYear() - 1);
      else if (filterTimeRange === '2Y') cutoff.setFullYear(now.getFullYear() - 2);

      filtered = filtered.filter(p => {
        const date = p.updatedAt ? new Date(p.updatedAt) : p.createdAt ? new Date(p.createdAt) : null;
        return date && date >= cutoff;
      });
    }

    return filtered;
  }, [allPayments, filterType, filterStatus, filterTimeRange]);

  // Get unique types and statuses for filter dropdowns
  const transactionTypes = useMemo(() => {
    const types = new Set();
    allPayments.forEach(p => types.add(getTransactionType(p)));
    return Array.from(types).sort();
  }, [allPayments]);

  const statuses = useMemo(() => {
    const st = new Set();
    allPayments.forEach(p => st.add(p.status));
    return Array.from(st).sort();
  }, [allPayments]);

  const handleViewDetails = (payment) => {
    setSelectedTransaction(payment);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner text="Loading transactions..." />;

  return (
    <Container className="py-4">
      <div className="section-heading">
        <span className="section-heading__icon">
          <i className="bi bi-receipt" />
        </span>
        <h2 className="section-heading__title">Transactions</h2>
      </div>
      <Card className="glass-nav border-0">
        <Card.Body>
          {/* Filters */}
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Label className="fw-semibold" style={{ color: 'var(--text)' }}>Type</Form.Label>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                {transactionTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="fw-semibold" style={{ color: 'var(--text)' }}>Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="fw-semibold" style={{ color: 'var(--text)' }}>Time Range</Form.Label>
              <Form.Select
                value={filterTimeRange}
                onChange={(e) => setFilterTimeRange(e.target.value)}
              >
                <option value="ALL">All Time</option>
                <option value="1M">Past 1 Month</option>
                <option value="3M">Past 3 Months</option>
                <option value="6M">Past 6 Months</option>
                <option value="1Y">Past 1 Year</option>
                <option value="2Y">Past 2 Years</option>
              </Form.Select>
            </Col>
          </Row>

          {filteredPayments.length === 0 ? (
            <p className="text-muted mb-0">No transactions found.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0" style={{ color: 'var(--text)' }}>
                <thead style={{ borderBottom: '2px solid var(--border)' }}>
                  <tr>
                    <th style={{ color: 'var(--text)' }}>#</th>
                    <th style={{ color: 'var(--text)' }}>Transaction ID</th>
                    <th style={{ color: 'var(--text)' }}>Amount</th>
                    <th style={{ color: 'var(--text)' }}>Type</th>
                    <th style={{ color: 'var(--text)' }}>Status</th>
                    <th style={{ color: 'var(--text)' }}>Time</th>
                    <th style={{ color: 'var(--text)' }}>More</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p, index) => {
                    const type = getTransactionType(p);
                    const transactionDate = p.updatedAt || p.createdAt;
                    const dateObj = transactionDate ? new Date(transactionDate) : null;
                    
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td>{index + 1}</td>
                        <td>{p.id}</td>
                        <td style={{ fontWeight: '600' }}>{formatCurrencyAmount(p.currency, p.amount)}</td>
                        <td>{type}</td>
                        <td>
                          <Badge bg={p.status === 'COMPLETED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'danger'}>
                            {p.status}
                          </Badge>
                        </td>
                        <td>{dateObj ? dateObj.toLocaleString() : '-'}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetails(p)}
                            className="hover-grow"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Transaction Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="glass-nav border-0" style={{ backgroundColor: 'color-mix(in oklab, var(--surface) 85%, transparent)' }}>
          <Modal.Title style={{ color: 'var(--text)' }}>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="glass-nav border-0" style={{ backgroundColor: 'color-mix(in oklab, var(--surface) 85%, transparent)' }}>
          {selectedTransaction && (
            <>
              <Row className="mb-3">
                <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>From Account:</Col>
                <Col sm={7} style={{ color: 'var(--text)' }}>
                  {getAccountNumber(selectedTransaction.fromAccountId) || `Account ${selectedTransaction.fromAccountId}`}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>To Account:</Col>
                <Col sm={7} style={{ color: 'var(--text)' }}>
                  {selectedTransaction.toAccountId === 0 || selectedTransaction.toAccountId === null ? (
                    (() => {
                      const ext = parseExternalTransfer(selectedTransaction.description);
                      return ext ? `${ext.accountNumber} / IFSC: ${ext.ifsc} (${ext.bankName})` : 'External Bank Transfer';
                    })()
                  ) : (
                    getAccountNumber(selectedTransaction.toAccountId) || `Account ${selectedTransaction.toAccountId}`
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>Amount:</Col>
                <Col sm={7} style={{ color: 'var(--text)', fontWeight: '600' }}>
                  {formatCurrencyAmount(selectedTransaction.currency, selectedTransaction.amount)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>Transaction Date:</Col>
                <Col sm={7} style={{ color: 'var(--text)' }}>
                  {selectedTransaction.updatedAt 
                    ? new Date(selectedTransaction.updatedAt).toLocaleString() 
                    : selectedTransaction.createdAt 
                      ? new Date(selectedTransaction.createdAt).toLocaleString() 
                      : '-'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>Type:</Col>
                <Col sm={7} style={{ color: 'var(--text)' }}>
                  {getTransactionType(selectedTransaction)}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>Status:</Col>
                <Col sm={7}>
                  <Badge bg={selectedTransaction.status === 'COMPLETED' ? 'success' : selectedTransaction.status === 'PENDING' ? 'warning' : 'danger'}>
                    {selectedTransaction.status}
                  </Badge>
                </Col>
              </Row>
              {selectedTransaction.description && (
                <Row>
                  <Col sm={5} className="fw-semibold" style={{ color: 'var(--muted)' }}>Description:</Col>
                  <Col sm={7} style={{ color: 'var(--text)' }}>{selectedTransaction.description}</Col>
                </Row>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="glass-nav border-0" style={{ backgroundColor: 'color-mix(in oklab, var(--surface) 85%, transparent)' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransactionsPage;

