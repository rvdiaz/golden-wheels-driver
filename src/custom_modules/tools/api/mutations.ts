import { gql } from '@apollo/client';

export const createTransUnionPropertyMutation = gql`
  mutation createTransUnionProperty($userId: ID!, $propertyData: PropertyInput!) {
    createTransUnionProperty(userId: $userId, propertyData: $propertyData) {
      propertyId
      attestations {
        attestationGroupId
        attestations {
          attestationId
          attestationTypeId
          name
          legalText
          affirmativeRequired
          additionalInformation
        }
      }
    }
  }
`;

export const updateTransUnionPropertyMutation = gql`
  mutation updateTransUnionProperty(
    $userId: ID!
    $propertyId: ID!
    $updates: TUPropertyUpdateInput!
  ) {
    updateTransUnionProperty(userId: $userId, propertyId: $propertyId, updates: $updates)
  }
`;

export const initiateRentApplicationMutation = gql`
  mutation initiateRentApplication(
    $tenant: TenantData!
    $userId: ID!
    $property: PropertyInput!
    $initialBundleId: ID
    $contactEmails: [String!]!
  ) {
    initiateRentApplication(
      tenant: $tenant
      userId: $userId
      property: $property
      initialBundleId: $initialBundleId
      contactEmails: $contactEmails
    ) {
      status
      rentApplicationId
      property {
        addressLine1
        locality
        region
        postalCode
        country
        propertyId
      }
      applicants {
        emailAddress
      }
      __typename
    }
  }
`;
