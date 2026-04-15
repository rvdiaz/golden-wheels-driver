import { gql } from '@apollo/client';

export const getUserNotificationsQuery = gql`
  query getUserNotifications($tenant: TenantData!, $limit: Int) {
    getUserNotifications(tenant: $tenant, limit: $limit) {
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
