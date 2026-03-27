import { gql } from '@apollo/client';

export const getExtraServicesQuery = gql`
  query getExtraServices($tenant: TenantData!) {
    getExtraServices(tenant: $tenant) {
      id
      name
      description
      price {
        amount
        currencyCode
      }
      image {
        url
        alt
      }
    }
  }
`;
