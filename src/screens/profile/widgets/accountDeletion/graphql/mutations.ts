import { gql } from '@apollo/client';

/**
 * Removes the signed-in driver's access to this organization. The driver is identified by the
 * token, never by an argument. The login itself and any balance owed are left alone.
 */
export const deleteMyDriverAccountMutation = gql`
  mutation deleteMyDriverAccount($tenantID: ID!, $organizationID: ID!) {
    deleteMyDriverAccount(tenantID: $tenantID, organizationID: $organizationID)
  }
`;
