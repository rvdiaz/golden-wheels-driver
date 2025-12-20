import { gql } from "@apollo/client";

export const listModifiersGroupsQuery = gql`
  query listModifiersGroups($tenantID: ID!) {
    listModifiersGroups(tenantID: $tenantID) {
      modifiersGroupID
      name
      description
    }
  }
`;

export const listModifiersQuery = gql`
  query listModifiers($tenantID: ID!) {
    listModifiers(tenantID: $tenantID) {
      modifierID
      isActive
      name
      price {
        amount
        currencyCode
      }
      description
    }
  }
`;
