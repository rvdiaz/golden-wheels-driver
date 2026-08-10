import React from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { ENV_Vars } from '~/store/env';
import { userData } from '~/store/user';
import { contactSubmissionMutation } from './graphql';
import { FormRenderer } from './formRendered';

// ─── Component ────────────────────────────────────────────────────────────────

export const ProcessForm = ({ form, variant }: { form: any; variant?: 'light' | 'dark' }) => {
  const [submitContact] = useMutation(contactSubmissionMutation);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const { data } = await submitContact({
        variables: {
          tenant: ENV_Vars.TENANT_ID,
          formData: {
            formId: form.formId,
            fields: JSON.stringify(values),
          },
        },
      });

      if (data?.contactSubmission) {
        return { success: true, message: 'Your message has been sent successfully!' };
      }

      return { success: false, message: 'Something went wrong. Please try again.' };
    } catch (error: any) {
      console.error('[ProcessForm] Submission error:', error);
      return {
        success: false,
        message: error?.message ?? 'Submission failed. Please try again.',
      };
    }
  };

  return (
    <FormRenderer
      fields={form.fields}
      onSubmit={handleSubmit}
      submitLabel={form.submitLabel ?? 'Send'}
      variant={variant}
    />
  );
};
