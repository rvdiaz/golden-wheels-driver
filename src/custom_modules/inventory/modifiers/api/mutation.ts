import { gql } from "@apollo/client";

export const createModifierMutation = gql`
  mutation createModifier($tenantID: ID!, $input: ModifierInput!) {
    createModifier(tenantID: $tenantID, input: $input) {
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

export const updateModifierMutation = gql`
  mutation updateModifier(
    $modifierID: ID!
    $tenantID: ID!
    $input: ModifierUpdateInput!
  ) {
    updateModifier(
      modifierID: $modifierID
      tenantID: $tenantID
      input: $input
    ) {
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

export const createModifiersGroupMutation = gql`
  mutation createModifiersGroup($tenantID: ID!, $input: ModifiersGroupInput!) {
    createModifiersGroup(tenantID: $tenantID, input: $input) {
      modifiersGroupID
      name
      description
    }
  }
`;

export const updateModifierGroupMutation = gql`
  mutation updateModifiersGroup(
    $modifiersGroupID: ID!
    $tenantID: ID!
    $input: ModifiersGroupUpdateInput!
  ) {
    updateModifiersGroup(
      modifiersGroupID: $modifiersGroupID
      tenantID: $tenantID
      input: $input
    ) {
      modifiersGroupID
      name
      description
    }
  }
`;

export const deleteModifierMutation = gql`
  mutation deleteModifier($modifierID: ID!, $tenantID: ID!) {
    deleteModifier(modifierID: $modifierID, tenantID: $tenantID)
  }
`;

export const deleteModifiersGroupMutation = gql`
  mutation deleteModifiersGroup($modifiersGroupID: ID!, $tenantID: ID!) {
    deleteModifiersGroup(
      modifiersGroupID: $modifiersGroupID
      tenantID: $tenantID
    )
  }
`;
