import { gql } from '@apollo/client';

export const updateDriverMutation = gql`
  mutation updateDriver($tenant: TenantData!, $driverId: ID!, $driver: DriverUpdateInput!) {
    updateDriver(tenant: $tenant, driverId: $driverId, driver: $driver) {
      id
      name
      email
      phone
      available
      pushToken
    }
  }
`;
