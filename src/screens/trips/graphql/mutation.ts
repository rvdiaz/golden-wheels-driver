import { gql } from '@apollo/client';

// Codidge shape. Field selection mirrors queries.ts's bookingFields closely enough that
// mapCodidgeBooking.ts handles both — kept inline rather than shared since GraphQL doesn't
// let you splice a fragment into two different operation names as cleanly as duplicating it.
export const updateDriverStatusMutation = gql`
  mutation updateDriverTripStatus(
    $organizationID: ID!
    $tenantID: ID!
    $bookingID: ID!
    $driverStatus: String!
  ) {
    updateDriverTripStatus(
      organizationID: $organizationID
      tenantID: $tenantID
      bookingID: $bookingID
      driverStatus: $driverStatus
    ) {
      bookingID
      bookingCode
      startDate
      endDate
      status
      driverStatus
      paymentStatus
      openForClaim
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
    }
  }
`;

/**
 * Take an open trip. First driver to land this wins — the backend uses a conditional write on
 * openForClaim + absence of a driver, so a losing racer gets a clean "already taken" error
 * (ConditionalCheckFailedException, surfaced as a plain Error) rather than silently overwriting
 * the winner.
 */
export const claimTripMutation = gql`
  mutation claimBooking($organizationID: ID!, $tenantID: ID!, $bookingID: ID!) {
    claimBooking(
      organizationID: $organizationID
      tenantID: $tenantID
      bookingID: $bookingID
    ) {
      bookingID
      status
      driverStatus
      openForClaim
      driver {
        driverID
        name
        email
        phone
      }
      revenueSplit {
        commissionPercentage
        driverAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;
