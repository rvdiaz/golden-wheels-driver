import { gql } from '@apollo/client';

export const getCarTypesQuery = gql`
  query getCarTypes($tenant: TenantData!, $returnAll: Boolean) {
    getCarTypes(tenant: $tenant, returnAll: $returnAll) {
      id
      name
      description
      image {
        url
        alt
      }
      maxPassengers
      features {
        label
        value
      }
      supportsHourly
      hourlyRate
      supportsDistance
      pricePerMiles
      baseFare
      minimumFare
    }
  }
`;

export const getCarTypesByTripQuery = gql`
  query getCarTypesByTrip($tenant: TenantData!, $input: CarTypesByTripAvailabilityInput!) {
    getCarTypesByTrip(tenant: $tenant, input: $input) {
      id
      name
      description
      image {
        url
        alt
      }
      maxPassengers
      features {
        label
        value
      }
      supportsHourly
      hourlyRate
      supportsDistance
      pricePerMiles
      baseFare
      minimumFare
      tripQuotePrice
    }
  }
`;
