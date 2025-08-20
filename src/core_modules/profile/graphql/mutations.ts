import { gql } from '@apollo/client';

export const addUserIncome = gql`
  mutation addUserIncome($tenant: TenantData!, $userId: ID!, $incomeData: UserInputIncome!) {
    addUserIncome(tenant: $tenant, userId: $userId, incomeData: $incomeData) {
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
