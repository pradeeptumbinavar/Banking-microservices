import api from './api';

export const adminService = {
  // Get all pending approvals (aggregated)
  getPendingApprovals: async () => {
    const response = await api.get('/admin/approvals/pending');
    return response.data;
  },

  // Execute bulk approvals
  executeBulkApprovals: async (data) => {
    const response = await api.post('/admin/approvals/execute', data);
    return response.data;
  },
};

