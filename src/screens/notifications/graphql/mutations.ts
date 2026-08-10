import { gql } from '@apollo/client';

/**
 * Ownership is enforced server-side against the caller's own mailbox, so passing an id from
 * another inbox returns `updated: 0` rather than an error — which is why `audience` has to
 * match the inbox the ids came from.
 */
export const markNotificationsReadMutation = gql`
  mutation markNotificationsRead($organizationID: ID!, $notificationIDs: [ID!]!) {
    markNotificationsRead(
      organizationID: $organizationID
      audience: driver
      notificationIDs: $notificationIDs
    ) {
      updated
      total
      notificationIDs
    }
  }
`;
