import { gql } from '@apollo/client';

export const markNotificationsAsReadMutation = gql`
  mutation markNotificationsAsRead($tenant: TenantData!, $userId: ID!, $notificationIds: [ID!]!) {
    markNotificationsAsRead(tenant: $tenant, userId: $userId, notificationIds: $notificationIds) {
      updated
      total
      notificationIds
    }
  }
`;
