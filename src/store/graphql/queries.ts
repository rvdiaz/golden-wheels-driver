import { gql } from '@apollo/client';

export const getTenantQuery = gql`
  query getTenant($tenantID: ID!) {
    getTenant(tenantID: $tenantID) {
      tenantID
      name
      address
      phone
      email
      isActive
      theme {
        colorPalette {
          primary
        }
        logo {
          url
          alt
          s3Key
        }
        cover {
          url
          alt
          s3Key
        }
      }
      businessHours {
        day
        open
        close
        isClosed
      }
      domain {
        url
      }
    }
  }
`;
