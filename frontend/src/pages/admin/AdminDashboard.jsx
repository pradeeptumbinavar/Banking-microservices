import React, { useMemo, useState } from 'react';
import { Container, Card, Tabs, Tab, Row, Col, Form, Button, Table, Spinner, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { KYCStatusOptions, AccountStatusOptions, CreditProductStatusOptions, PaymentStatusOptions } from '../../constants/enums';

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

function ApprovalsTable({ columns, rows, loading, selectedIds, onToggleRow, onToggleAll, statusGetter }) {
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
                      <Badge bg={statusGetter(r[c.key])}>{r[c.key]}</Badge>
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
      const res = await api.get(ep.get);
      setRows(res.data || res);
    } catch (e) {
      toast.error('Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
      setSelectedIds([]);
      setBulkStatus(null);
    }
  };

  const onSelectTab = async (k) => {
    setActive(k);
    await fetchTab(k);
  };

  const applyBulk = async () => {
    const ep = Endpoints[active];
    if (!bulkStatus || selectedIds.length === 0) return;
    try {
      await api.post(ep.post, { ids: selectedIds, status: bulkStatus });
      toast.success('Bulk action applied');
      await fetchTab(active);
    } catch (e) {
      toast.error('Bulk action failed');
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Approvals</h2>
      <Card className="p-3">
        <Tabs activeKey={active} onSelect={onSelectTab} className="mb-3">
          <Tab eventKey="KYC" title="KYC" />
          <Tab eventKey="Accounts" title="Accounts" />
          <Tab eventKey="Credits" title="Credits" />
          <Tab eventKey="Payments" title="Payments" />
        </Tabs>

        <BulkBar
          options={Endpoints[active].statuses}
          value={bulkStatus}
          onChange={setBulkStatus}
          count={selectedIds.length}
          onApply={applyBulk}
          disabled={loading}
        />

        <ApprovalsTable
          columns={columns}
          rows={rows}
          loading={loading}
          selectedIds={selectedIds}
          onToggleRow={(id, checked) => setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id))}
          onToggleAll={(allIds, checked) => setSelectedIds(checked ? allIds : [])}
          statusGetter={statusVariant}
        />
      </Card>
    </Container>
  );
};

export default AdminDashboard;

