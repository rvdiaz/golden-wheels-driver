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
