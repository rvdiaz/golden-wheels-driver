import { gql } from '@apollo/client';

export const searchLocationsQueries = gql`
  query searchLocations($tenant: TenantData!, $state: String!, $input: String!) {
    searchLocations(tenant: $tenant, state: $state, input: $input) {
      county
      city
      propertyTax
    }
  }
`;

export const getTransUnionPropertyAttestationsQuery = gql`
  query getTransunionPropertiesAttestations($userId: ID!, $propertyId: ID!) {
    getTransunionPropertiesAttestations(userId: $userId, propertyId: $propertyId) {
      propertyId
      attestations {
        attestationGroupId
        attestations {
          attestationId
          attestationTypeId
          name
          legalText
          affirmativeRequired
          additionalInformation
        }
      }
    }
  }
`;

export const getSearchAutoCompleteQuery = gql`
  query AutocompleteSearch($input: String!) {
    autoCompleteSearch(input: $input) {
      places {
        placeId
        displayName
        address
        meta
      }
    }
  }
`;

export const getTransunionPropertyQuery = gql`
  query getTransunionProperties($userId: ID!) {
    getTransunionProperties(userId: $userId) {
      isActive
      addressLine1
      addressLine2
      addressLine3
      addressLine4
      locality
      region
      postalCode
      country
      propertyId
    }
  }
`;

export const getRentApplications = gql`
  query getUserRentApplications($userId: ID!) {
    getUserRentApplications(userId: $userId) {
      lastKey
      items {
        rentApplicationId
        status
        createdAt
        property {
          addressLine1
          locality
          region
          postalCode
          country
          propertyId
        }
        applicants {
          renterStatus
          screeningRequestId
          screeningRequestRenterId
          income
          incomeFrequency
          otherIncome
          otherIncomeFrequency
          assets
          employmentStatus
          emailAddress
          firstName
          lastName
          phoneNumber
          phoneType
          dateOfBirth
          acceptedTermsAndConditions
          hasPets
          petDescription
          monthlyRent
          reasonForMoving
          landloardName
          landloardPhone
          hasEvicted
          evictedDescription
          hasCrimes
          crimesDescription
          reportPdfUrl
          renterReportItems {
            providerName
            reportData
          }
          homeAddress {
            addressLine1
            locality
            region
            postalCode
            country
          }
        }
      }
    }
  }
`;

export const getScreenRequestQuery = gql`
  query getScreenRequest($userId: ID!) {
    getScreeningRequest(userId: $userId) {
      createdOn
      initialBundleId
      landlordExternalReferenceId
      modifiedOn
      propertyId
      propertyName
      propertySummaryAddress
      screeningRequestId
      screeningRequestRenters {
        bundleId
        createdOn
        landlordExternalReferenceId
        modifiedOn
        renterFirstName
        renterId
        renterLastName
        renterMiddleName
        renterRole
        renterStatus
        screeningRequestRenterId
      }
    }
  }
`;

export const getApplicantReportQuery = gql`
  query getApplicantReport(
    $screeningRequestRenterId: ID!
    $rentApplicationId: ID!
    $aplicantID: ID!
  ) {
    getApplicantReport(
      screeningRequestRenterId: $screeningRequestRenterId
      rentApplicationId: $rentApplicationId
      aplicantID: $aplicantID
    ) {
      renterReportItems {
        providerName
        reportData
      }
      fileUrl
    }
  }
`;

export const getPropertyOwnerQuery = gql`
  query fetchOwnerContact(
    $first_name: String!
    $last_name: String!
    $state: String!
    $zip: String!
    $address: String!
    $city: String!
  ) {
    fetchOwnerContact(
      first_name: $first_name
      last_name: $last_name
      state: $state
      zip: $zip
      address: $address
      city: $city
    ) {
      email {
        email
        emailType
      }
      phones {
        phone
        phoneDisplay
        doNotCall
      }
      fullName
      mailAddress {
        address
        label
      }
      owner1FirstName
      owner1LastName
    }
  }
`;

export const getMlsListingQuery = gql`
  query getMlsListing($input: MlsListingParams!) {
    getMlsListing(input: $input) {
      indexCount
      listings {
        bathrooms
        bedrooms
        estimatedEquity
        estimatedValue
        id
        mlsNumber
        imageUrl
        listingId
        lotSquareFeet
        mlsAgent {
          email
          fullName
        }
        mlsDaysOnMarket
        mlsLastStatusDate
        mlsListingPrice
        propertyType
        yearBuilt
        address {
          address
          city
          label
          state
          zip
        }
        absenteeOwner
        foreclosure
        preForeclosure
        assumable
        apn
        customStatus
      }
    }
  }
`;

export const getPropertyQuery = gql`
  query getProperyDetail(
    $propertyId: String!
    $needOwnerContact: Boolean
    $zipCode: String
    $apn: ID
  ) {
    getPropertyData(
      propertyId: $propertyId
      needOwnerContact: $needOwnerContact
      zipCode: $zipCode
      apn: $apn
    ) {
      vacant
      propertyType
      propertyInfo {
        address {
          address
          label
          state
          zip
          city
        }
        bathrooms
        bedrooms
        lotSquareFeet
        yearBuilt
        propertyUse
      }
      foreclosureInfo {
        foreclosureId
      }
      estimatedEquity
      estimatedValue
      mlsHistory {
        agentEmail
        agentName
        agentOffice
        agentPhone
        baths
        beds
        daysOnMarket
        price
        propertyId
        seqNo
        status
        type
      }
      mortgageHistory {
        amount
        documentNumber
        granteeName
        lenderName
        lenderType
        open
        position
        propertyType
        term
        termType
      }
      ownerInfo {
        email {
          email
          emailType
        }
        phones {
          phone
          phoneDisplay
        }
        fullName
        mailAddress {
          address
          label
        }
      }
    }
  }
`;

export const getPropertyEstimationQuery = gql`
  query getPropertyEstimations(
    $propertyId: String!
    $propertyAddress: String!
    $needClosestProperties: Boolean
  ) {
    getPropertyEstimations(
      propertyId: $propertyId
      propertyAddress: $propertyAddress
      needClosestProperties: $needClosestProperties
    ) {
      avm {
        address
        apn
        avm
        avmMax
        avmMin
        confidence
      }
      comps {
        id
        address {
          address
          state
          zip
          city
        }
        yearBuilt
        lotSquareFeet
        bathrooms
        bedrooms
        landUse
        estimatedValue
      }
      property {
        vacant
        propertyType
        propertyInfo {
          address {
            address
            label
            state
            zip
          }
          bathrooms
          bedrooms
          lotSquareFeet
          yearBuilt
          propertyUse
        }
        foreclosureInfo {
          foreclosureId
        }
        estimatedEquity
        estimatedValue
        mlsHistory {
          agentEmail
          agentName
          agentOffice
          agentPhone
          baths
          beds
          daysOnMarket
          price
          propertyId
          seqNo
          status
          type
        }
        mortgageHistory {
          amount
          documentNumber
          granteeName
          lenderName
          lenderType
          open
          position
          propertyType
          term
          termType
        }
        ownerInfo {
          email {
            email
            emailType
          }
          phones {
            phone
            phoneDisplay
          }
          fullName
          mailAddress {
            address
            label
          }
        }
      }
    }
  }
`;
