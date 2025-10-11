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

export const onNotificationPublishedSubscription = gql`
  subscription onNotificationPublished(
    $tenantId: ID
    $userId: ID
    $sent: Boolean
    $showOnApp: Boolean
  ) {
    onNotificationPublished(
      tenantId: $tenantId
      userId: $userId
      sent: $sent
      showOnApp: $showOnApp
    ) {
      tenantId
      userId
      sent
      showOnApp
      userNotification {
        notificationId
        tenantId
        userId
        title
        body
        channels
        showOnApp
        data
        scheduleDate
        createdAt
        sent
        sentAt
        read
        readAt
      }
    }
  }
`;
