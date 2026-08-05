import { gql } from '@apollo/client';

export const getDriverProfileQuery = gql`
  query getDriverProfile($tenant: TenantData!) {
    getDriverProfile(tenant: $tenant) {
      id
      name
      email
      phone
      licenseNumber
      available
      preferenceLanguage
      pushToken
    }
  }
`;
