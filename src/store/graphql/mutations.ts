import { gql } from "@apollo/client";

export const updateTenantProfile = gql`
  mutation updateTenant($id: String!, $tenant: TenantUpdateArgs) {
    updateTenant(id: $id, tenant: $tenant) {
      id
      fullName
      communications {
        email
        phone
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
      address
      theme {
        colorPalette {
          primary
        }
        logo {
          alt
          s3Key
          url
        }
        cover {
          alt
          s3Key
          url
        }
      }
    }
  }
`;
