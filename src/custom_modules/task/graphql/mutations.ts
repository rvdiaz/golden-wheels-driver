import { gql } from '@apollo/client';

export const addTaskMutation = gql`
  mutation addTask($tenant: TenantData!, $userId: String!, $task: TaskInput!) {
    addTask(tenant: $tenant, userId: $userId, task: $task) {
      category
      id
      date
      isCompleted
      priority
      title
      startTime
      endTime
    }
  }
`;

export const completeTaskMutation = gql`
  mutation completeTask(
    $tenant: TenantData!
    $userId: String!
    $task: TaskCompletionInput!
    $completionParam: Boolean!
  ) {
    completeTask(tenant: $tenant, userId: $userId, task: $task, completionParam: $completionParam) {
      category
      id
      date
      isCompleted
      priority
      title
      startTime
      endTime
    }
  }
`;

export const updateTaskMutation = gql`
  mutation updateTask(
    $tenant: TenantData!
    $userId: String!
    $taskId: ID!
    $date: AWSDate!
    $updates: TaskUpdateInput!
  ) {
    updateTask(tenant: $tenant, userId: $userId, taskId: $taskId, date: $date, updates: $updates) {
      category
      id
      date
      isCompleted
      priority
      title
      startTime
      endTime
    }
  }
`;

export const deleteTaskMutation = gql`
  mutation deleteTask($tenant: TenantData!, $userId: String!, $taskId: ID!) {
    deleteTask(tenant: $tenant, userId: $userId, taskId: $taskId)
  }
`;
