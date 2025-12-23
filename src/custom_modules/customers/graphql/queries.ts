import { gql } from '@apollo/client';

export const LIST_CUSTOMERS_QUERY = gql`
  query listCustomers($tenantID: ID!) {
    listCustomers(tenantID: $tenantID) {
      firstName
      lastName
      phone
      email
      customerID
      createdAt
    }
  }
`;
