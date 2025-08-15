import { gql } from '@apollo/client';

export const addCustomerMutation = gql`
  mutation addCustomer($tenant: TenantData!, $customer: CustomerInput!) {
    addCustomer(tenant: $tenant, customer: $customer) {
      email
      id
      image {
        alt
        s3Key
        url
      }
      name
      phone
    }
  }
`;
