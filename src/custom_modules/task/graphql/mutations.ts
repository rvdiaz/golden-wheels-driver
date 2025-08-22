import { gql } from '@apollo/client';

export const addTaskMutation = gql`
  mutation addTask($tenant: TenantData!, $userId: String!, $task: TaskInput!) {
    addTask(tenant: $tenant, userId: $userId, task: $task) {
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

export const updateTaskMutation = gql`
  mutation updateTask(
    $tenant: TenantData!
    $userId: String!
    $taskId: ID!
    $updates: TaskUpdateInput!
  ) {
    updateTask(tenant: $tenant, userId: $userId, taskId: $taskId, updates: $updates) {
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

export const deleteTaskMutation = gql`
  mutation deleteTask($tenant: TenantData!, $userId: String!, $taskId: ID!) {
    deleteTask(tenant: $tenant, userId: $userId, taskId: $taskId)
  }
`;
