import { gql } from "@apollo/client";

export const createCollection = gql`
  mutation createCategory($input: CategoryInput!, $tenantID: ID!) {
    createCategory(input: $input, tenantID: $tenantID) {
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

export const updateCollections = gql`
  mutation updateCategory(
    $categoryID: ID!
    $tenantID: ID!
    $input: CategoryInput!
  ) {
    updateCategory(
      categoryID: $categoryID
      tenantID: $tenantID
      input: $input
    ) {
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

export const deleteCategoryMutation = gql`
  mutation deleteCategory($categoryID: ID!, $tenantID: ID!) {
    deleteCategory(categoryID: $categoryID, tenantID: $tenantID)
  }
`;
