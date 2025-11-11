import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Tabs, Tab, Row, Col, Form, Button, Table, Spinner, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { KYCStatusOptions, AccountStatusOptions, CreditProductStatusOptions, PaymentStatusOptions, getStatusDetails } from '../../constants/enums';

const Endpoints = {
  // Use Admin aggregator endpoints so all tabs return a common shape { id, type, status, description, service }
  KYC:      { get: '/admin/customers/approvals', post: '/admin/customers/approvals/bulk', statuses: KYCStatusOptions.map(o => o.value) },
  Accounts: { get: '/admin/accounts/approvals',  post: '/admin/accounts/approvals/bulk',  statuses: AccountStatusOptions.map(o => o.value) },
  Credits:  { get: '/admin/credits/approvals',   post: '/admin/credits/approvals/bulk',   statuses: CreditProductStatusOptions.filter(o => ['APPROVED','REJECTED','ACTIVE','CLOSED'].includes(o.value)).map(o => o.value) },
  Payments: { get: '/admin/payments/approvals',  post: '/admin/payments/approvals/bulk',  statuses: PaymentStatusOptions.filter(o => ['COMPLETED','REJECTED'].includes(o.value)).map(o => o.value) }
};

function BulkBar({ options, value, onChange, count, onApply, disabled }) {
  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <Form.Select value={value || ''} onChange={(e) => onChange(e.target.value || null)} style={{ maxWidth: 260 }}>
        <option value="">Select status</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </Form.Select>
      <Button variant="primary" onClick={onApply} disabled={disabled || !value || count === 0}>
        Apply to {count} selected
      </Button>
    </div>
  );
}

function ApprovalsTable({ columns, rows, loading, selectedIds, onToggleRow, onToggleAll, statusGetter, statusIconGetter }) {
  const allIds = rows.map(r => r.id);
  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center py-5"><Spinner /></div>
      ) : rows.length === 0 ? (
        <Card className="p-4"><div className="text-center text-muted">No records. Try Refresh.</div></Card>
      ) : (
        <Table hover responsive className="bg-white rounded">
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <Form.Check type="checkbox" checked={allSelected} onChange={(e) => onToggleAll(allIds, e.target.checked)} />
              </th>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>
                  <Form.Check type="checkbox" checked={selectedIds.includes(r.id)} onChange={(e) => onToggleRow(r.id, e.target.checked)} />
                </td>
                {columns.map(c => (
                  <td key={c.key}>
                    {c.key === 'status' ? (
                      <Badge bg={statusGetter(r[c.key])}>
                        {statusIconGetter ? (
                          <i className={`bi bi-${statusIconGetter(r[c.key])} me-1`} />
                        ) : null}
                        {r[c.key]}
                      </Badge>
                    ) : (
                      r[c.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [active, setActive] = useState('KYC');
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prefetching, setPrefetching] = useState(true);
  const [cache, setCache] = useState({}); // { KYC: [], Accounts: [], Credits: [], Payments: [] }

  const columns = useMemo(() => {
    const desiredByTab = {
      KYC: [
        { key: 'customerId', label: 'CustomerID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'KYC Status' },
        { key: 'createdAt', label: 'CreatedAt' }
      ],
      Accounts: [
        { key: 'id', label: 'AccountID' },
        { key: 'accountNumber', label: 'AccountNumber' },
        { key: 'customerId', label: 'CustomerID' },
        { key: 'accountType', label: 'Type' },
        { key: 'balance', label: 'Balance' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'CreatedAt' }
      ],
      Credits: [
        { key: 'id', label: 'CreditID' },
        { key: 'customerId', label: 'CustomerID' },
        { key: 'productType', label: 'ProductType' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'CreatedAt' }
      ],
      Payments: [
        { key: 'id', label: 'PaymentID' },
        { key: 'fromAccountId', label: 'FromAccount' },
        { key: 'toAccountId', label: 'ToAccount' },
        { key: 'amount', label: 'Amount' },
        { key: 'paymentType', label: 'PaymentType' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'CreatedAt' }
      ]
    };

    const desired = desiredByTab[active] || [];
    const available = rows && rows.length ? Object.keys(rows[0]) : [];
    const filtered = desired.filter(c => available.includes(c.key));

    // Generic admin-aggregated payload support across all tabs
    const hasGeneric = ['type','description','service'].some(k => available.includes(k));
    if (hasGeneric) {
      const order = ['id', 'type', 'description', 'service', 'status'];
      const cols = order
        .filter(k => available.includes(k))
        .map(k => ({ key: k, label: k === 'id' ? 'ID' : k.replace(/^[a-z]/, m => m.toUpperCase()) }));
      if (cols.length) return cols;
    }

    if (filtered.length > 0) return filtered;
    // Fallback: derive columns from available keys
    return available.map(k => ({ key: k, label: k.toUpperCase() }));
  }, [active, rows]);

  const statusVariant = (s) => {
    switch (s) {
      case 'PENDING': return 'warning';
      case 'APPROVED':
      case 'ACTIVE':
      case 'COMPLETED': return 'success';
      case 'REJECTED':
      case 'SUSPENDED':
      case 'FAILED':
      case 'CLOSED': return 'danger';
      default: return 'secondary';
    }
  };

  const fetchTab = async (tab) => {
    const ep = Endpoints[tab];
    setLoading(true);
    try {
      console.info('[Admin] GET', ep.get);
      const res = await api.get(ep.get);
      const data = res.data || res;
      console.info('[Admin] Loaded', tab, Array.isArray(data) ? data.length : 0);
      setRows(data);
      setCache(prev => ({ ...prev, [tab]: data }));
    } catch (e) {
      console.error('[Admin] GET failed', ep.get, e);
      toast.error(e?.response?.data?.message || 'Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
      setSelectedIds([]);
      setBulkStatus(null);
    }
  };

  // Prefetch all approval lists at once on mount
  useEffect(() => {
    let isMounted = true;
    async function prefetchAll() {
      setPrefetching(true);
      setLoading(true);
      try {
        const entries = Object.entries(Endpoints);
        const results = await Promise.all(entries.map(async ([key, ep]) => {
          console.info('[Admin] Prefetch GET', ep.get);
          try {
            const res = await api.get(ep.get);
            return [key, res.data || res];
          } catch (e) {
            console.error('[Admin] Prefetch failed', ep.get, e);
            return [key, []];
          }
        }));
        if (!isMounted) return;
        const dataMap = Object.fromEntries(results);
        Object.keys(dataMap).forEach(k => console.info('[Admin] Prefetched', k, Array.isArray(dataMap[k]) ? dataMap[k].length : 0));
        setCache(dataMap);
        // Initialize rows for the default active tab from cache
        setRows(dataMap[active] || []);
      } catch (e) {
        if (isMounted) {
          console.error('[Admin] Prefetch error', e);
          toast.error(e?.response?.data?.message || 'Failed to prefetch approvals');
          setRows([]);
        }
      } finally {
        if (isMounted) {
          setPrefetching(false);
          setLoading(false);
          setSelectedIds([]);
          setBulkStatus(null);
        }
      }
    }
    prefetchAll();
    return () => { isMounted = false; };
  }, []);

  const onSelectTab = async (k) => {
    setActive(k);
    // If cached data exists for this tab, show it immediately; otherwise fetch
    if (cache && cache[k]) {
      setRows(cache[k]);
      setSelectedIds([]);
      setBulkStatus(null);
    } else {
      await fetchTab(k);
    }
  };

  const applyBulk = async () => {
    const ep = Endpoints[active];
    if (!bulkStatus || selectedIds.length === 0) return;
    try {
      console.info('[Admin] POST', ep.post, { ids: selectedIds, status: bulkStatus });
      await api.post(ep.post, { ids: selectedIds, status: bulkStatus });
      toast.success('Bulk action applied');
      await fetchTab(active);
    } catch (e) {
      console.error('[Admin] POST failed', ep.post, e);
      toast.error(e?.response?.data?.message || 'Bulk action failed');
    }
  };

  const statusIconGetter = (status) => {
    const typeMap = { KYC: 'kyc', Accounts: 'account', Credits: 'credit', Payments: 'payment' };
    const typeKey = typeMap[active] || 'account';
    const details = getStatusDetails(status, typeKey);
    return details?.icon;
  };

  return (
    <Container className="py-4">
      <div className="section-heading">
        <span className="section-heading__icon"><i className="bi bi-ui-checks-grid" /></span>
        <h2 className="section-heading__title m-0">Admin Approvals</h2>
      </div>
      <Card className="glass-nav border-0 p-3">
        <Tabs activeKey={active} onSelect={onSelectTab} className="mb-3">
          <Tab eventKey="KYC" title={<><i className="bi bi-shield-check me-1" />KYC</>} />
          <Tab eventKey="Accounts" title={<><i className="bi bi-wallet2 me-1" />Accounts</>} />
          <Tab eventKey="Credits" title={<><i className="bi bi-credit-card me-1" />Credits</>} />
          <Tab eventKey="Payments" title={<><i className="bi bi-arrow-left-right me-1" />Payments</>} />
        </Tabs>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <BulkBar
            options={Endpoints[active].statuses}
            value={bulkStatus}
            onChange={setBulkStatus}
            count={selectedIds.length}
            onApply={applyBulk}
            disabled={loading || prefetching}
          />
          <Button variant="outline-secondary" size="sm" disabled={loading || prefetching}
            onClick={async () => {
              // Refresh all at once with a single cache update
              setPrefetching(true);
              try {
                const entries = await Promise.all(Object.keys(Endpoints).map(async (key) => {
                  const res = await api.get(Endpoints[key].get);
                  const data = res.data || res;
                  return [key, data];
                }));
                const updated = Object.fromEntries(entries);
                setCache(updated);
                setRows(updated[active] || []);
                toast.success('Approvals refreshed');
              } catch (e) {
                toast.error(e?.response?.data?.message || 'Failed to refresh approvals');
              } finally {
                setPrefetching(false);
                setSelectedIds([]);
                setBulkStatus(null);
              }
            }}>
            Refresh All
          </Button>
        </div>
        {prefetching ? (
          <div className="d-flex justify-content-center py-5"><Spinner /></div>
        ) : (
          <ApprovalsTable
          columns={columns}
          rows={rows}
          loading={loading}
          selectedIds={selectedIds}
          onToggleRow={(id, checked) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
          onToggleAll={(allIds, checked) => setSelectedIds(checked ? allIds : [])}
          statusGetter={statusVariant}
          statusIconGetter={statusIconGetter}
          />
        )}
      </Card>
    </Container>
  );
};

export default AdminDashboard;

