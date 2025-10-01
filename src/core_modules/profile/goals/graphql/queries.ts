import { gql } from '@apollo/client';

export const getActiveUserGoals = gql`
  query getActiveUserGoals($tenant: TenantData!, $userId: String!) {
    getActiveUserGoals(tenant: $tenant, userId: $userId) {
      progressId
      userId
      goalId
      goalName
      goalDescription
      goalKey
      targetValue
      value
      unit
      frequency
      period
      createdAt
      updatedAt
      completed
      active
    }
  }
`;
