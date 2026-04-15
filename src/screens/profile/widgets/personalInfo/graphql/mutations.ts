import { gql } from '@apollo/client';

export const updateCustomerMutation = gql`
  mutation updateCustomer($tenant: TenantData!, $customer: CustomerUpdateInput!) {
    updateCustomer(tenant: $tenant, customer: $customer) {
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
  mutation deleteCustomer($tenant: TenantData!) {
    deleteCustomer(tenant: $tenant)
  }
`;
