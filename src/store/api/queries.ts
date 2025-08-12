import { gql } from "@apollo/client";

export const getAdminUser = gql`
  query getAdminUser($id: String!, $firstTime: Boolean) {
    getAdminUser(id: $id, firstTime: $firstTime) {
      email
      id
      name
      role
      status
      metaData
      permissions {
        slug
        label
      }
    }
  }
`;
