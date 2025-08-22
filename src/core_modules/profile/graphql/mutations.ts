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

export const updateUserIncome = gql`
  mutation updateUserIncome(
    $tenant: TenantData!
    $userId: ID!
    $incomeId: ID!
    $incomeData: UserInputIncome!
  ) {
    updateUserIncome(
      tenant: $tenant
      userId: $userId
      incomeId: $incomeId
      incomeData: $incomeData
    ) {
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

export const deleteUserIncomeMutation = gql`
  mutation deleteUserIncome($tenant: TenantData!, $userId: ID!, $incomeId: ID!) {
    deleteUserIncome(tenant: $tenant, userId: $userId, incomeId: $incomeId)
  }
`;
