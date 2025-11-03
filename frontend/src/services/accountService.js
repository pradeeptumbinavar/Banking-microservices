import api from './api';

export const accountService = {
  // Get accounts for current user
  getCustomerAccounts: async (userId) => {
    const response = await api.get(`/accounts/user/${userId}`);
    return response.data;
  },

  // Get account by ID
  getAccountById: async (id) => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  // Create new account
  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  // Update account
  updateAccount: async (id, accountData) => {
    const response = await api.put(`/accounts/${id}`, accountData);
    return response.data;
  },

  // Close account
  closeAccount: async (id) => {
    const response = await api.delete(`/accounts/${id}`);
    return response.data;
  },

  // Get account balance
  getAccountBalance: async (id) => {
    const response = await api.get(`/accounts/${id}/balance`);
    return response.data;
  },

  // Get accounts by user ID
  getAccountsByUserId: async (userId, status = null) => {
    const params = status ? { status } : {};
    const response = await api.get(`/accounts/user/${userId}`, { params });
    return response.data;
  },

  // Get pending approvals (Admin)
  getPendingApprovals: async () => {
    const response = await api.get('/accounts/approvals');
    return response.data;
  },

  // Bulk approve/reject (Admin)
  bulkApproveReject: async (data) => {
    const response = await api.post('/accounts/approvals/bulk', data);
    return response.data;
  },
};

