import { gql } from '@apollo/client';

export const updateCustomerMutation = gql`
  mutation updateCustomer($tenant: TenantData!, $customerId: ID!, $customer: CustomerUpdateInput!) {
    updateCustomer(tenant: $tenant, customerId: $customerId, customer: $customer) {
      name
      email
      phone
      preferenceLanguage
      image {
        url
        alt
      }
    }
  }
`;

export const deleteCustomerMutation = gql`
  mutation deleteCustomer($tenant: TenantData!, $customerId: ID!) {
    deleteCustomer(tenant: $tenant, customerId: $customerId)
  }
`;
