import { gql } from '@apollo/client';

export const addBookingQuery = gql`
  mutation addBooking($tenant: TenantData!, $booking: BookingInput!) {
    addBooking(tenant: $tenant, booking: $booking) {
      id
      bookingCode
      startDate
      endDate
      status
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
        }
        dropoffLocation {
          id
          displayName
          formattedAddress
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

export const updateBookingMutation = gql`
  mutation updateBooking($tenant: TenantData!, $bookingId: ID!, $booking: BookingUpdateInput) {
    updateBooking(tenant: $tenant, bookingId: $bookingId, booking: $booking) {
      id
      bookingCode
      startDate
      endDate
      status
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
        }
        dropoffLocation {
          id
          displayName
          formattedAddress
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
