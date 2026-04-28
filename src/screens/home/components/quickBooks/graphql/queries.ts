import { gql } from '@apollo/client';

export const quickBookOptionsQuery = gql`
  query quickBookOptions($tenant: TenantData!) {
    quickBookOptions(tenant: $tenant) {
      id
      title
      image {
        url
        alt
      }
      address {
        id
        formattedAddress
        displayName
        types
      }
      icon
    }
  }
`;
