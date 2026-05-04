import { gql } from '@apollo/client';

export const getPaymentPublisCredentialsQuery = gql`
  query getPaymentPublisCredentials($tenant: TenantData!) {
    getPaymentPublisCredentials(tenant: $tenant) {
      publicKey
      stripeAccountId
    }
  }
`;
