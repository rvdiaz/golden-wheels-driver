import { gql } from "@apollo/client";

export const createProduct = gql`
  mutation createProduct($tenantID: ID!, $input: ProductInput!) {
    createProduct(tenantID: $tenantID, input: $input) {
      productID
      name
      description
      htmlDescription
      basePrice {
        amount
        currencyCode
      }
      salePrice {
        amount
        currencyCode
      }
      imageCatalog {
        principal
        image {
          alt
          s3Key
          url
        }
      }
      quantity {
        availableQuantity
        unlimited
      }
      categoryIDs
      modifiersGroupIDs
      isActive
      variantOptions {
        name
        options {
          value
        }
      }
      variants {
        image {
          alt
          s3Key
          url
        }
        optionValues {
          optionName
          selectedValue
        }
        price {
          amount
          currencyCode
        }
        quantity {
          availableQuantity
          unlimited
        }
        variantID
        variantName
        isActive
      }
      createdAt
    }
  }
`;

export const deleteProduct = gql`
  mutation deleteProduct($productID: ID!, $tenantID: ID!) {
    deleteProduct(productID: $productID, tenantID: $tenantID)
  }
`;

export const updateProducts = gql`
  mutation updateProduct(
    $productID: ID!
    $tenantID: ID!
    $input: ProductUpdateInput!
  ) {
    updateProduct(productID: $productID, tenantID: $tenantID, input: $input) {
      productID
      name
      description
      htmlDescription
      basePrice {
        amount
        currencyCode
      }
      salePrice {
        amount
        currencyCode
      }
      imageCatalog {
        principal
        image {
          alt
          s3Key
          url
        }
      }
      quantity {
        availableQuantity
        unlimited
      }
      categoryIDs
      modifiersGroupIDs
      isActive
      variantOptions {
        name
        options {
          value
        }
      }
      variants {
        image {
          alt
          s3Key
          url
        }
        optionValues {
          optionName
          selectedValue
        }
        price {
          amount
          currencyCode
        }
        quantity {
          availableQuantity
          unlimited
        }
        isActive
        variantID
        variantName
      }
      createdAt
    }
  }
`;
