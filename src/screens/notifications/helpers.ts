export const getUserNotificationsVariables = (userId = '') => ({
  tenant: {
    tenantId: '',
  },
  userId,
  limit: 30,
});
