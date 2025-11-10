import { gql } from '@apollo/client';

export const getOpenHouseListingsQuery = gql`
  query GetOpenHouseListings($tenant: TenantData!, $ownerId: ID) {
    getOpenHouseListings(tenant: $tenant, ownerId: $ownerId) {
      items {
        id
        tenantId
        mlsListingId
        description
        createdAt
        updatedAt
        status
        ownerId
        geoHash
        address
        city
        state
        zipCode
        mlsNumber
        mlsAgentEmail
        mlsAgentFullName
        mlsLastStatusDate
        imageUrl
        bedrooms
        bathrooms
        yearBuilt
        mlsListingPrice
      }
      lastKey {
        PK
        SK
      }
    }
  }
`;

export const getOpenHouseVisitRequestsQuery = gql`
  query GetOpenHouseVisitRequests(
    $tenant: TenantData!
    $ownerId: ID
    $requesterId: ID
    $lastKey: CompositeKeyInput
  ) {
    getOpenHouseVisitRequests(
      tenant: $tenant
      ownerId: $ownerId
      requesterId: $requesterId
      lastKey: $lastKey
    ) {
      items {
        id
        tenantId
        openHouseListingId
        requesterName
        requesterId
        ownerId
        ownerName
        createdAt
        updatedAt
        status
        mlsListingId
        geoHash
        address
        city
        state
        zipCode
        mlsNumber
        date
        message
        response
        time
      }
      lastKey {
        PK
        SK
      }
    }
  }
`;
