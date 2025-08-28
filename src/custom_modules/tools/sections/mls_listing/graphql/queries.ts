import { gql } from '@apollo/client';

export const getMlsListingQuery = gql`
  query getMlsListing($input: MlsListingParams!) {
    getMlsListing(input: $input) {
      bathrooms
      bedrooms
      estimatedEquity
      estimatedValue
      id
      imageUrl
      listingId
      lotSquareFeet
      mlsAgent {
        email
        fullName
      }
      mlsDaysOnMarket
      mlsListingPrice
      propertyType
      yearBuilt
      address {
        address
        city
        label
        state
        zip
      }
    }
  }
`;
