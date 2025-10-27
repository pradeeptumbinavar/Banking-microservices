import api from './api';

export const customerService = {
  // Create customer profile
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Submit KYC documents
  submitKYC: async (id, kycData) => {
    const response = await api.post(`/customers/${id}/kyc`, kycData);
    return response.data;
  },

  // Update customer status
  updateCustomerStatus: async (id, statusData) => {
    const response = await api.patch(`/customers/${id}/status`, statusData);
    return response.data;
  },

  // Search customers
  searchCustomers: async (params) => {
    const response = await api.get('/customers/search', { params });
    return response.data;
  },

  // Get pending KYC approvals (Admin)
  getPendingApprovals: async () => {
    const response = await api.get('/customers/approvals');
    return response.data;
  },

  // Bulk approve/reject KYC (Admin)
  bulkApproveReject: async (data) => {
    const response = await api.post('/customers/approvals/bulk', data);
    return response.data;
  },
};

