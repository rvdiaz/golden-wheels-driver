import { gql } from '@apollo/client';

export const getTaskByUserQuery = gql`
  query getTasksByUser($customerId: String!, $date: AWSDate) {
    getTasksByUser(customerId: $customerId, date: $date) {
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
  query getTask($customerId: String!, $taskId: ID!) {
    getSingleTask(customerId: $customerId, taskId: $taskId) {
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
