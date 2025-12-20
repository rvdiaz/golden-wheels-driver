import { gql } from '@apollo/client';

export const getAdminUserQuery = gql`
  query getAdminUser($userID: ID!, $firstTime: Boolean) {
    getAdminUser(userID: $userID, firstTime: $firstTime) {
      userID
      tenantsList {
        role
        tenantID
      }
      name
      email
      phone
      status
      userType
      permissions {
        label
        slug
      }
      metaData
    }
  }
`;
