import { gql } from '@apollo/client';

export const getActiveUserGoals = gql`
  query getActiveUserGoals($tenant: TenantData!, $userId: String!, $templateId: ID!) {
    getActiveUserGoals(tenant: $tenant, userId: $userId, templateId: $templateId) {
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
      group
    }
  }
`;
