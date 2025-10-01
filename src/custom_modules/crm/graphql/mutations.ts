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

export const deleteContactMutation = gql`
  mutation deleteUserContact($tenant: TenantData!, $userId: ID!, $contactId: ID!) {
    deleteUserContact(tenant: $tenant, userId: $userId, contactId: $contactId)
  }
`;

export const markDoneUserFollowUpMutation = gql`
  mutation markDoneUserFollowUp(
    $tenant: TenantData!
    $userId: ID!
    $followUpId: ID!
    $date: AWSDate!
  ) {
    markDoneUserFollowUp(tenant: $tenant, userId: $userId, followUpId: $followUpId, date: $date) {
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
`;

export const addFollowUpMutation = gql`
  mutation addFollowUpMutation($tenant: TenantData!, $input: CreateFollowUpInput!) {
    createUserFollowUp(tenant: $tenant, input: $input) {
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
`;
