import { gql } from '@apollo/client';

/**
 * Neither query takes a driverId — the server resolves the driver from the
 * Cognito token, so this app cannot ask for anyone else's money.
 */
export const getDriverBalanceQuery = gql`
  query getDriverBalance($tenant: TenantData!) {
    getDriverBalance(tenant: $tenant) {
      driverId
      balance
      totalEarned
      totalPaid
      currencyCode
      lastEntryAt
      updatedAt
    }
  }
`;

export const getDriverLedgerQuery = gql`
  query getDriverLedger($tenant: TenantData!, $limit: Int, $nextToken: String) {
    getDriverLedger(tenant: $tenant, limit: $limit, nextToken: $nextToken) {
      items {
        entryId
        type
        amount
        currencyCode
        occurredAt
        createdAt
        description
        sourceBookingId
        bookingCode
        paymentMethod
        paymentReference
      }
      nextToken
    }
  }
`;
