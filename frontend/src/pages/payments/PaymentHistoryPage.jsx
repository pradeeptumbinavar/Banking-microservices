import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/paymentService';
import { accountService } from '../../services/accountService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrencyAmount } from '../../utils/currency';
import { toast } from 'react-toastify';

const PaymentHistoryPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        // Workaround: backend endpoint /payments/user/{userId} actually filters by accountId
        const lookupId = user?.customerId || user?.id;
        const accounts = await accountService.getAccountsByUserId(lookupId);
        const accountIds = (accounts || []).map(a => a.id);

        if (accountIds.length === 0) {
          setPayments([]);
          return;
        }

        const lists = await Promise.all(
          accountIds.map(id => paymentService.getPaymentsByUserId(id).catch(() => []))
        );
        const merged = lists.flat();
        // Dedupe by id and sort by createdAt desc
        const byId = new Map();
        merged.forEach(p => { if (p?.id != null) byId.set(p.id, p); });
        const unique = Array.from(byId.values()).sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        setPayments(unique);
      } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user?.id, user?.customerId]);

  if (loading) return <LoadingSpinner text="Loading payment history..." />;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Payment History</h2>
      <Card>
        <Card.Body>
          {payments.length === 0 ? (
            <p className="text-muted">No transactions yet.</p>
          ) : (
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.fromAccountId}</td>
                    <td>{p.toAccountId}</td>
                    <td>{formatCurrencyAmount(p.currency, p.amount)}</td>
                    <td>
                      <Badge bg={p.status === 'COMPLETED' ? 'success' : p.status === 'PENDING' ? 'warning' : 'danger'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentHistoryPage;

