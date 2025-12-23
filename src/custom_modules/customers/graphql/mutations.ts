import { gql } from '@apollo/client';

export const CREATE_CUSTOMER_MUTATION = gql`
  mutation createCustomer($tenantID: ID!, $input: CustomerInput!) {
    createCustomer(tenantID: $tenantID, input: $input) {
      firstName
      lastName
      phone
      email
      customerID
      createdAt
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation updateCustomer($tenantID: ID!, $customerID: ID!, $input: CustomerUpdateInput!) {
    updateCustomer(tenantID: $tenantID, customerID: $customerID, input: $input) {
      firstName
      lastName
      phone
      email
      customerID
      createdAt
    }
  }
`;

export const DELETE_CUSTOMER_MUTATION = gql`
  mutation deleteCustomer($tenantID: ID!, $customerID: ID!) {
    deleteCustomer(tenantID: $tenantID, customerID: $customerID)
  }
`;
