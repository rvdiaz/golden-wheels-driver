import { gql } from '@apollo/client';

export const getUserIncomes = gql`
  query getUserIncomes($tenant: TenantData!, $userId: ID!) {
    getUserIncomes(tenant: $tenant, userId: $userId) {
      id
      amount
      createdAt
      description
      expectedDate
      propertyAddress
      source
      status
    }
  }
`;
