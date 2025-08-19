import { gql } from '@apollo/client';

export const searchLocationsQueries = gql`
  query searchLocations($tenant: TenantData!, $state: String!, $input: String!) {
    searchLocations(tenant: $tenant, state: $state, input: $input) {
      county
      city
      propertyTax
    }
  }
`;

export const getSearchAutoCompleteQuery = gql`
  query AutocompleteSearch($input: String!) {
    autoCompleteSearch(input: $input) {
      places {
        placeId
        displayName
        address
      }
    }
  }
`;
