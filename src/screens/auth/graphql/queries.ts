import { gql } from '@apollo/client';

export const getCustomerQuery = gql`
  query getCustomer($tenant: TenantData!, $token: String, $appInfo: AppInfoInput) {
    getCustomer(tenant: $tenant, token: $token, appInfo: $appInfo) {
      id
      name
      email
      phone
      preferenceLanguage
    }
  }
`;
