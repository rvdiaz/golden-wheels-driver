import { gql } from '@apollo/client';

export const getDriverBookingsQuery = gql`
  query getDriverBookings($tenant: TenantData!) {
    getDriverBookings(tenant: $tenant) {
      id
      bookingCode
      startDate
      endDate
      status
      driverStatus
      paymentStatus
      createdAt
      note
      assignmentMode
      poolState
      driverEarnings {
        amount
        currencyCode
      }
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
          maxPassengers
        }
        extraServices {
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
        bookHours
        bookMode
      }
    }
  }
`;

/**
 * Trips published to the pool that nobody has claimed yet. Same shape as
 * getDriverBookings so the same card component renders both.
 */
export const getOpenTripsQuery = gql`
  query getOpenTrips($tenant: TenantData!) {
    getOpenTrips(tenant: $tenant) {
      id
      bookingCode
      startDate
      endDate
      status
      driverStatus
      paymentStatus
      createdAt
      note
      assignmentMode
      poolState
      offeredAt
      driverEarnings {
        amount
        currencyCode
      }
      bookingBusinessData {
        customer {
          id
          name
          phone
        }
        carType {
          id
          name
          maxPassengers
        }
        extraServices {
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
        bookHours
        bookMode
      }
    }
  }
`;
