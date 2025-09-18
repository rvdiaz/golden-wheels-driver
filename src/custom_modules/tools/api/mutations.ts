import { gql } from '@apollo/client';

export const createTransUnionPropertyMutation = gql`
  mutation createTransUnionProperty($userId: ID!, $propertyData: PropertyInput!) {
    createTransUnionProperty(userId: $userId, propertyData: $propertyData) {
      propertyId
    }
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
        propertyName
      }
      applicants {
        emailAddress
      }
      __typename
    }
  }
`;
