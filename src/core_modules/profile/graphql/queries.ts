import { gql } from '@apollo/client';

export const getUserIncomes = gql`
  query getUserIncomes($tenant: TenantData!, $userId: ID!) {
    getUserIncomes(tenant: $tenant, userId: $userId) {
      amount
      createdAt
      description
      expectedDate
      id
      propertyAddress
      source
      status
    }
  }
`;
