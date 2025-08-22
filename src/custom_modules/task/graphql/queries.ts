import { gql } from '@apollo/client';

export const getTaskByUserQuery = gql`
  query getTasksByUser($tenant: TenantData!, $userId: String!, $date: AWSDate) {
    getTasksByUser(tenant: $tenant, userId: $userId, date: $date) {
      category
      currentProgress
      description
      id
      date
      isCompleted
      priority
      scheduledTime
      targetCount
      title
      source
      status
    }
  }
`;

export const getTaskQuery = gql`
  query getTask($tenant: TenantData!, $userId: String!, $taskId: ID!) {
    getSingleTask(tenant: $tenant, userId: $userId, taskId: $taskId) {
      category
      currentProgress
      description
      id
      date
      isCompleted
      priority
      scheduledTime
      targetCount
      title
      source
      status
    }
  }
`;
