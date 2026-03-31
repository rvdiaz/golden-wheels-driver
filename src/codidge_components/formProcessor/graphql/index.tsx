import { gql } from '@apollo/client';

export const contactSubmissionMutation = gql`
  mutation contactSubmission($tenant: TenantData!, $formData: ContactFormDataInput!) {
    contactSubmission(tenant: $tenant, formData: $formData)
  }
`;
