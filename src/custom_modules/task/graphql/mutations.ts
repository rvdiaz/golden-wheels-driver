import { gql } from '@apollo/client';

export const addTaskMutation = gql`
  mutation addTask($customerId: String!, $task: TaskInput!) {
    addTask(customerId: $customerId, task: $task) {
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
  mutation updateTask($customerId: String!, $taskId: ID!, $updates: TaskUpdateInput!) {
    updateTask(customerId: $customerId, taskId: $taskId, updates: $updates) {
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
  mutation deleteTask($customerId: String!, $taskId: ID!) {
    deleteTask(customerId: $customerId, taskId: $taskId)
  }
`;
