import { gql } from '@apollo/client';

export const addBookingMutation = gql`
  mutation addBooking($tenant: TenantData!, $booking: BookingInput!) {
    addBooking(tenant: $tenant, booking: $booking) {
      id
      bookingCode
      startDate
      endDate
      status
      driverStatus
      createdAt
      note
      bookingBusinessData {
        customer {
          id
          name
          email
          phone
        }
        driver {
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
          supportsHourly
          hourlyRate
          supportsDistance
          pricePerMiles
          baseFare
          minimumFare
          maxPassengers
        }
        extraServices {
          id
          name
          description
          price {
            amount
            currencyCode
          }
          createdAt
          image {
            alt
            url
          }
          available
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

export const cancellationRequestTripMutation = gql`
  mutation cancellationRequestTrip($tenant: TenantData!, $bookingId: ID!) {
    cancellationRequestTrip(tenant: $tenant, bookingId: $bookingId) {
      id
      bookingCode
      startDate
      endDate
      status
      driverStatus
      createdAt
      note
      bookingBusinessData {
        customer {
          id
          name
          email
          phone
        }
        driver {
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
          supportsHourly
          hourlyRate
          supportsDistance
          pricePerMiles
          baseFare
          minimumFare
          maxPassengers
        }
        extraServices {
          id
          name
          description
          price {
            amount
            currencyCode
          }
          createdAt
          image {
            alt
            url
          }
          available
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

export const createPaymentIntentMutation = gql`
  mutation createPaymentIntent($tenant: TenantData!, $bookingId: ID!) {
    createPaymentIntent(tenant: $tenant, bookingId: $bookingId) {
      clientSecret
      stripeCustomerId
      ephemeralKey
    }
  }
`;

export const updateBookingMutation = gql`
  mutation updateBooking($tenant: TenantData!, $bookingId: ID!, $booking: BookingUpdateInput) {
    updateBooking(tenant: $tenant, bookingId: $bookingId, booking: $booking) {
      id
      bookingCode
      startDate
      endDate
      status
      driverStatus
      createdAt
      note
      bookingBusinessData {
        customer {
          id
          name
          email
          phone
        }
        driver {
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
          supportsHourly
          hourlyRate
          supportsDistance
          pricePerMiles
          baseFare
          minimumFare
          tripQuotePrice
          maxPassengers
        }
        extraServices {
          id
          name
          description
          price {
            amount
            currencyCode
          }
          createdAt
          image {
            alt
            url
          }
          available
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

export const cancelPaymentIntentMutation = gql`
  mutation cancelPaymentIntent($tenant: TenantData!, $bookingId: ID!) {
    cancelPaymentIntent(tenant: $tenant, bookingId: $bookingId) {
      success
    }
  }
`;
