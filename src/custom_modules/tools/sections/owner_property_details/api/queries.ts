import { gql } from '@apollo/client';

export const getPropertyQuery = gql`
  query getProperyDetail($propertyId: String!, $needOwnerContact: Boolean) {
    getPropertyData(propertyId: $propertyId, needOwnerContact: $needOwnerContact) {
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
        lastStatusDate
        price
        propertyId
        seqNo
        status
        statusDate
        type
      }
      mortgageHistory {
        amount
        documentDate
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
  query getPropertyEstimations($propertyId: String!, $needClosestProperties: Boolean) {
    getPropertyEstimations(propertyId: $propertyId, needClosestProperties: $needClosestProperties) {
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
          lastStatusDate
          price
          propertyId
          seqNo
          status
          statusDate
          type
        }
        mortgageHistory {
          amount
          documentDate
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
