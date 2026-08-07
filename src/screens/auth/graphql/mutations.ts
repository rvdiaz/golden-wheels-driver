import { gql } from '@apollo/client';

// Codidge shape — no pushToken field on Driver yet (that's part of the deferred
// notifications work), so this only carries the fields Codidge actually has.
export const updateDriverMutation = gql`
  mutation updateDriver($tenantID: ID!, $driverID: ID!, $input: DriverUpdateInput!) {
    updateDriver(tenantID: $tenantID, driverID: $driverID, input: $input) {
      id: driverID
      name
      email
      phone
      available
    }
  }
`;
