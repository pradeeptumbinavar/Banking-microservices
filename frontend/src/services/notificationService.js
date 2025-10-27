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
};

