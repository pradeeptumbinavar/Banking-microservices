import api from './api';

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Validate current access token
  validateToken: async () => {
    // Some backends expose POST /auth/validate; if only /auth/me exists, use that.
    // We'll prefer /auth/me as it both validates and returns user info.
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/auth/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },

  // Create customer profile (called automatically after registration)
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Get customer by userId with fallback to email search
  getCustomerByUserId: async (userId, email) => {
    try {
      const response = await api.get(`/customers/user/${userId}`);
      return response.data;
    } catch (err) {
      if (!email) throw err;
      const resp = await api.get('/customers/search', { params: { email } });
      return Array.isArray(resp.data) ? resp.data[0] : resp.data;
    }
  },

  // Update customer profile
  updateCustomer: async (customerId, data) => {
    const response = await api.put(`/customers/${customerId}`, data);
    return response.data;
  },
};

