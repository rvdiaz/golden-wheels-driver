import { gql } from '@apollo/client';

export const getCustomerBookingQuery = gql`
  query getCustomerBooking($customerId: ID!, $tenant: TenantData!) {
    getCustomerBooking(customerId: $customerId, tenant: $tenant) {
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
