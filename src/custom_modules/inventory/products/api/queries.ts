import { gql } from "@apollo/client";

export const listProductsQuery = gql`
  query listProduct($tenantID: ID!) {
    listProduct(tenantID: $tenantID) {
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

export const getProductsIdsQuery = gql`
  query getProducts($tenant: TenantData!) {
    getProducts(tenant: $tenant) {
      id
      title
      type
      imageCatalog {
        image {
          alt
          url
        }
        principal
      }
    }
  }
`;

export const getProduct = gql`
  query getProduct($id: ID!, $tenant: TenantData!) {
    getProduct(id: $id, tenant: $tenant) {
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
