import { gql } from '@apollo/client';

export const getUserNotificationsQuery = gql`
  query getUserNotifications($tenant: TenantData!, $userId: ID!, $limit: Int) {
    getUserNotifications(tenant: $tenant, userId: $userId, limit: $limit) {
      items {
        notificationId
        title
        body
        createdAt
        read
      }
    }
  }
`;
