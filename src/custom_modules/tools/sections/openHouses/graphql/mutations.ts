import { gql } from '@apollo/client';

export const createOpenHouseListingMutation = gql`
  mutation CreateOpenHouseListing($input: OpenHouseListingInput!, $tenant: TenantData!) {
    createOpenHouseListing(input: $input, tenant: $tenant) {
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
  }
`;

export const deleteOpenHouseListingMutation = gql`
  mutation DeleteOpenHouseListing($tenant: TenantData!, $id: ID!, $ownerId: ID!) {
    deleteOpenHouseListing(tenant: $tenant, id: $id, ownerId: $ownerId)
  }
`;

export const createOpenHouseVisitRequestMutation = gql`
  mutation CreateOpenHouseVisitRequest($input: OpenHouseVisitRequestInput!, $tenant: TenantData!) {
    createOpenHouseVisitRequest(input: $input, tenant: $tenant) {
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
      time
    }
  }
`;

export const updateOpenHouseVisitRequestStatusMutation = gql`
  mutation UpdateOpenHouseVisitRequest(
    $tenant: TenantData!
    $userId: ID!
    $id: ID!
    $status: String!
    $response: String
  ) {
    updateOpenHouseVisitRequest(
      tenant: $tenant
      userId: $userId
      id: $id
      status: $status
      response: $response
    ) {
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
      time
      message
      response
    }
  }
`;

export const deleteOpenHouseVisitRequestMutation = gql`
  mutation DeleteOpenHouseVisitRequest($tenant: TenantData!, $id: ID!, $requesterId: ID!) {
    deleteOpenHouseVisitRequest(tenant: $tenant, id: $id, requesterId: $requesterId)
  }
`;
