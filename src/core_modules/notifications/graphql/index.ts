import { gql } from '@apollo/client';

export const getUserNotificationsQuery = gql`
  query getUserNotifications(
    $tenant: TenantData!
    $userId: ID!
    $lastKey: CompositeKeyInput
    $limit: Int
  ) {
    getUserNotifications(tenant: $tenant, userId: $userId, lastKey: $lastKey, limit: $limit) {
      items {
        notificationId
        title
        body
        createdAt
      }
    }
  }
`;
