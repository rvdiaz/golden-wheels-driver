import { gql } from '@apollo/client';

export const addCustomerMutation = gql`
  mutation addCustomer($tenant: TenantData!, $customer: CustomerInput!, $customerID: String) {
    addCustomer(tenant: $tenant, customer: $customer, customerID: $customerID) {
      id
      name
      email
      phone
    }
  }
`;

export const updateUserMutation = gql`
  mutation updateUser($tenant: TenantData!, $customer: CustomerUpdateInput!, $customerId: ID!) {
    updateUser(tenant: $tenant, customer: $customer, customerId: $customerId) {
      id
      name
      email
      phone
    }
  }
`;

export const deleteUserMutation = gql`
  mutation deleteUser($tenant: TenantData!, $userId: ID!) {
    deleteUser(tenant: $tenant, userId: $userId)
  }
`;
