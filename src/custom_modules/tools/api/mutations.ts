import { gql } from '@apollo/client';

export const createTransUnionPropertyMutation = gql`
  mutation createTransUnionProperty($userId: ID!, $propertyData: PropertyInput!) {
    createTransUnionProperty(userId: $userId, propertyData: $propertyData) {
      propertyId
    }
  }
`;

export const createScreeningMutation = gql`
  mutation createScreeningRequest($userId: ID!, $propertyId: ID!, $initialBundleId: ID) {
    createScreeningRequest(
      userId: $userId
      propertyId: $propertyId
      initialBundleId: $initialBundleId
    ) {
      screeningRequestId
    }
  }
`;
