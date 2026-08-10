import { gql } from '@apollo/client';

/**
 * Registers this device for push.
 *
 * Nothing here identifies the driver, and nothing needs to. The resolver builds the recipient
 * key from the verified Cognito id token — `ORG#<organizationID>#DRIVER#<sub>` — so this works
 * even though the app stores `driverID` rather than the sub: `driverID` is a generated id and
 * is never sent. What lines the two ends up is on the backend, where driver notifications are
 * addressed by `Driver.cognitoSub`, which is the same value this app's token carries.
 *
 * `audience: driver` is the whole point of this file. Customers and drivers share one Cognito
 * pool, so a person who drives for Golden Wheels *and* rides with it holds one credential and
 * two mailboxes. Without the audience both apps would register into the same partition and each
 * would receive the other's pushes.
 *
 * The write is an idempotent upsert on (recipientKey, token), so re-registering on every launch
 * refreshes `lastSeenAt` instead of adding a row.
 */
export const registerDeviceTokenCodidgeMutation = gql`
  mutation registerDeviceToken(
    $organizationID: ID!
    $token: String!
    $platform: String
    $deviceName: String
  ) {
    registerDeviceToken(
      organizationID: $organizationID
      audience: driver
      token: $token
      platform: $platform
      deviceName: $deviceName
    ) {
      token
      platform
      lastSeenAt
    }
  }
`;

/**
 * Called on sign-out, so a shared phone stops receiving the previous driver's trip alerts.
 * Only this device's row goes; the same person's customer-app registration is a different key
 * and survives.
 */
export const unregisterDeviceTokenCodidgeMutation = gql`
  mutation unregisterDeviceToken($organizationID: ID!, $token: String!) {
    unregisterDeviceToken(
      organizationID: $organizationID
      audience: driver
      token: $token
    )
  }
`;
