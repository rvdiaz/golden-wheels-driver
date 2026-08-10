import { gql } from '@apollo/client';

// Codidge shape — flat, no TenantData/bookingBusinessData wrapper. Field names differ enough
// from Rentra's that consumers go through mapCodidgeBooking.ts rather than reading this
// directly; see that file for the field-by-field reasoning.
const bookingFields = `
      tenantID
      bookingID
      bookingCode
      status
      driverStatus
      paymentStatus
      openForClaim
      startDate
      endDate
      createdAt
      note
      bookHours
      bookMode
      customer {
        customerID
        name
        email
        phone
      }
      driver {
        driverID
        name
        email
        phone
      }
      car {
        carID
        brand
        model
      }
      carType {
        carTypeID
        name
      }
      pickupLocation {
        placeId
        displayName
        address
      }
      dropoffLocation {
        placeId
        displayName
        address
      }
      totalPrice {
        amount
        currencyCode
      }
      revenueSplit {
        commissionPercentage
        driverAmount {
          amount
          currencyCode
        }
      }
      paymentFailureCode
      paymentFailureMessageCustomer
`;

// The caller's own assigned/claimed trips — resolved from the verified token, no driverID arg.
export const getDriverBookingsQuery = gql`
  query getDriverBookings($tenantID: ID!) {
    getDriverBookings(tenantID: $tenantID) {
${bookingFields}
    }
  }
`;

/**
 * Trips published to the pool that nobody has claimed yet. Same shape as
 * getDriverBookings so the same mapper and card components render both.
 */
export const getOpenTripsQuery = gql`
  query getOpenBookings($tenantID: ID!) {
    getOpenBookings(tenantID: $tenantID) {
${bookingFields}
    }
  }
`;
