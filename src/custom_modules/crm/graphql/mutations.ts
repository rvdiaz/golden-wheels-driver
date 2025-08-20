import { gql } from '@apollo/client';

export const addContactMutation = gql`
  mutation addContact($tenant: TenantData!, $userId: ID!, $contactData: ContactInput!) {
    addUserContact(tenant: $tenant, userId: $userId, contactData: $contactData) {
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
    }
  }
`;
