import { gql } from '@apollo/client';

export const getUserContacts = gql`
  query getUserContacts($tenant: TenantData!, $userId: String!) {
    getUserContacts(tenant: $tenant, userId: $userId) {
      id
      firstName
      lastName
      email
      phone
      address
      category
      priority
      leadStatus
      leadStatusHistory
      notes
      type
      convertedAt
      updatedAt
      createdAt
    }
  }
`;

export const getUserFollowUpsQuery = gql`
  query getUserFollowUps($tenant: TenantData!, $input: FollowUpFilter!) {
    getUserFollowUps(tenant: $tenant, input: $input) {
      total
      followUps {
        contact {
          contactId
          email
          firstName
          lastName
          phone
        }
        date
        time
        followUpId
        isDone
        title
        notes
        userId
      }
    }
  }
`;
