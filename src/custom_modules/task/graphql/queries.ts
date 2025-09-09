import { gql } from '@apollo/client';

export const getTaskByUserQuery = gql`
  query getTasksByUser(
    $tenant: TenantData!
    $userId: String!
    $userActiveTemplateId: ID!
    $date: AWSDate
  ) {
    getTasksByUser(
      tenant: $tenant
      userId: $userId
      userActiveTemplateId: $userActiveTemplateId
      date: $date
    ) {
      category
      id
      date
      isCompleted
      priority
      title
      startTime
      endTime
      source
      description
      progress {
        goalKey
        goalType
        value
      }
    }
  }
`;

export const getTaskQuery = gql`
  query getTask($tenant: TenantData!, $userId: String!, $taskId: ID!) {
    getSingleTask(tenant: $tenant, userId: $userId, taskId: $taskId) {
      category
      id
      date
      isCompleted
      priority
      title
      startTime
      endTime
      source
      description
      progress {
        goalKey
        goalType
        value
      }
    }
  }
`;
