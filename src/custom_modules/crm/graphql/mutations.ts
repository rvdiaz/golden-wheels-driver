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
      followedUp
      followUp
    }
  }
`;

export const updateContactMutation = gql`
  mutation updateContact(
    $tenant: TenantData!
    $userId: ID!
    $contactId: ID!
    $contactData: ContactUpdateInput!
  ) {
    updateUserContact(
      tenant: $tenant
      userId: $userId
      contactId: $contactId
      contactData: $contactData
    ) {
      id
      firstName
      lastName
      email
      address
      category
      priority
      leadStatus
      leadStatusHistory
      notes
      type
      convertedAt
      followedUp
      followUp
    }
  }
`;

export const deleteContactMutation = gql`
  mutation deleteUserContact($tenant: TenantData!, $userId: ID!, $contactId: ID!) {
    deleteUserContact(tenant: $tenant, userId: $userId, contactId: $contactId)
  }
`;
