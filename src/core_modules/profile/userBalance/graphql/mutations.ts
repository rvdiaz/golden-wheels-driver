import { gql } from '@apollo/client';

export const takeUserBalanceMutation = gql`
  mutation takeUserBalance($tenant: TenantData!, $userId: ID!, $amount: Float!) {
    takeUserBalance(tenant: $tenant, userId: $userId, amount: $amount) {
      amount
      currency
    }
  }
`;
