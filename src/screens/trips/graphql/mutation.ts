import { gql } from '@apollo/client';

export const updateDriverStatusMutation = gql`
  mutation updateDriverStatus($tenant: TenantData!, $bookingId: ID!, $driverStatus: String!) {
    updateDriverStatus(tenant: $tenant, bookingId: $bookingId, driverStatus: $driverStatus) {
      id
      bookingCode
      startDate
      endDate
      status
      driverStatus
      bookingBusinessData {
        customer {
          id
          name
          email
          phone
        }
        car {
          id
          brand
          model
        }
        carType {
          id
          name
        }
        pickupLocation {
          id
          displayName
          formattedAddress
          types
        }
        dropoffLocation {
          id
          displayName
          formattedAddress
          types
        }
        totalPrice {
          amount
          currencyCode
        }
        bookHours
        bookMode
      }
    }
  }
`;

/**
 * Take an open trip. First driver to land this wins — the backend uses a
 * conditional write, so a losing racer gets a clean "already taken" error
 * rather than silently overwriting the winner.
 */
export const claimTripMutation = gql`
  mutation claimTrip($tenant: TenantData!, $bookingId: ID!) {
    claimTrip(tenant: $tenant, bookingId: $bookingId) {
      id
      status
      driverStatus
      poolState
      claimedAt
      driverEarnings {
        amount
        currencyCode
      }
    }
  }
`;
