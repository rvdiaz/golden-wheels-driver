import { gql } from '@apollo/client';

/**
 * The driver's own inbox.
 *
 * There is deliberately no recipient argument — the server derives the mailbox from the
 * verified Cognito id token. `organizationID` says which business (the participant pool is
 * shared platform-wide) and `audience: driver` says which of this person's roles: the same
 * human can drive for Golden Wheels and ride with it, and those are two separate inboxes.
 */
export const listMyNotificationsQuery = gql`
  query listMyNotifications($organizationID: ID!, $limit: Int, $before: AWSDateTime) {
    listMyNotifications(
      organizationID: $organizationID
      audience: driver
      limit: $limit
      before: $before
    ) {
      items {
        notificationID
        type
        title
        body
        data
        read
        createdAt
      }
      nextBefore
    }
  }
`;

/** Counted server-side, so the badge and the list cannot disagree. */
export const getMyUnreadCountQuery = gql`
  query getMyUnreadCount($organizationID: ID!) {
    getMyUnreadCount(organizationID: $organizationID, audience: driver)
  }
`;
