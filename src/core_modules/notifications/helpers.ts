import Constants from 'expo-constants';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const getUserNotificationsVariables = (userId = '') => ({
  tenant: {
    tenantId,
  },
  userId,
  limit: 30,
});
