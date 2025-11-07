import api from './api';

export const notificationService = {
  // Send notification
  sendNotification: async (notificationData) => {
    const response = await api.post('/notifications/send', notificationData);
    return response.data;
  },

  // Get notification by ID
  getNotificationById: async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  // Get notifications by user
  getByUserId: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  getUnseenCount: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}/unseen-count`);
    return response.data;
  },

  markAllSeen: async (userId) => {
    const response = await api.put(`/notifications/user/${userId}/seen-all`);
    return response.data;
  },

  markSeen: async (id) => {
    const response = await api.put(`/notifications/${id}/seen`);
    return response.data;
  },
};

