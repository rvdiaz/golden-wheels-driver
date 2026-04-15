import { gql } from '@apollo/client';

export const markNotificationsAsReadMutation = gql`
  mutation markNotificationsAsRead($tenant: TenantData!, $notificationIds: [ID!]!) {
    markNotificationsAsRead(tenant: $tenant, notificationIds: $notificationIds) {
      updated
      total
      notificationIds
    }
  }
`;
