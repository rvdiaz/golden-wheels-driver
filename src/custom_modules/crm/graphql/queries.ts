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
      followedUp
      followUp
    }
  }
`;
