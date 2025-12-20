import { gql } from "@apollo/client";

export const getCollectionsQuery = gql`
  query listCategory($tenantID: ID!, $includeProducts: Boolean) {
    listCategory(tenantID: $tenantID, includeProducts: $includeProducts) {
      categoryID
      name
      description
      htmlDescription
      imageCatalog {
        principal
        image {
          alt
          s3Key
          url
        }
      }
      productIDs
      isActive
      products {
        productID
        name
        description
        imageCatalog {
          principal
          image {
            alt
            s3Key
            url
          }
        }
      }
    }
  }
`;

export const getCollectionsIdsQuery = gql`
  query getCollections($tenantID: ID!) {
    getCollections(tenantID: $tenantID) {
      id
    }
  }
`;

export const getCollection = gql`
  query getCollection($categoryID: ID!, $tenantID: ID!) {
    getCollection(categoryID: $categoryID, tenantID: $tenantID) {
      categoryID
      name
      description
      htmlDescription
      imageCatalog {
        principal
        image {
          alt
          s3Key
          url
        }
      }
      productIDs
      isActive
      products {
        productID
        name
        description
        imageCatalog {
          principal
          image {
            alt
            s3Key
            url
          }
        }
      }
    }
  }
`;
