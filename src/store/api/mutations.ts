import { gql } from "@apollo/client";

export const updateTenantProfile = gql`
  mutation updateTenant($id: String!, $tenant: TenantArgs) {
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
      }
      solutions {
        name
        slug
        tenantModules {
          label
          moduleKey
          path
          metaData
          modules {
            label
            metaData
            moduleKey
          }
        }
        rolesSettings {
          name
          defaultPermissions {
            slug
            label
          }
        }
      }
    }
  }
`;
