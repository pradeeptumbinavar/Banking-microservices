import api from './api';

export const creditService = {
  // Apply for loan
  applyForLoan: async (loanData) => {
    const response = await api.post('/credits/loans', loanData);
    return response.data;
  },

  // Apply for credit card
  applyForCreditCard: async (cardData) => {
    const response = await api.post('/credits/cards', cardData);
    return response.data;
  },

  // Get credit product by ID
  getCreditProductById: async (id) => {
    const response = await api.get(`/credits/${id}`);
    return response.data;
  },

  // Get credit products by user
  getCreditProductsByUserId: async (userId) => {
    const response = await api.get(`/credits/user/${userId}`);
    return response.data;
  },

  // Update credit product (sends only allowed fields)
  updateCreditProduct: async (id, productData) => {
    const allowed = ['amount', 'creditLimit', 'interestRate', 'status'];
    const payload = Object.fromEntries(
      Object.entries(productData || {}).filter(([k]) => allowed.includes(k))
    );
    const response = await api.put(`/credits/${id}`, payload);
    return response.data;
  },

  // Close credit product
  closeCreditProduct: async (id) => {
    const response = await api.delete(`/credits/${id}`);
    return response.data;
  },

  // Get pending approvals (Admin)
  getPendingApprovals: async () => {
    const response = await api.get('/credits/approvals');
    return response.data;
  },

  // Bulk approve/reject (Admin)
  bulkApproveReject: async (data) => {
    const response = await api.post('/credits/approvals/bulk', data);
    return response.data;
  },
};

