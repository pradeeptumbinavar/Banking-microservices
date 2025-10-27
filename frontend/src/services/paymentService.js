import api from './api';

export const paymentService = {
  // Create fund transfer
  createTransfer: async (transferData) => {
    const response = await api.post('/payments/transfer', transferData);
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Get payments by user
  getPaymentsByUserId: async (userId) => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },

  // Update payment
  updatePayment: async (id, paymentData) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },

  // Cancel payment
  cancelPayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // Get pending approvals (Admin)
  getPendingApprovals: async () => {
    const response = await api.get('/payments/approvals');
    return response.data;
  },

  // Bulk approve/reject (Admin)
  bulkApproveReject: async (data) => {
    const response = await api.post('/payments/approvals/bulk', data);
    return response.data;
  },
};

