import { useQuery } from '@apollo/client';
import { ENV_Vars } from '~/store/env';
import { QuickBookOption } from '../interfaces';
import { quickBookOptionsQuery } from '../graphql/queries';
import { apiKeyClient } from '~/store/config/apolloClient';

export const useQuickBooks = () => {
  const {
    data,
    loading: loadingQuickBooks,
  } = useQuery<{
    quickBookOptions: QuickBookOption[];
  }>(quickBookOptionsQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
    },
    client: apiKeyClient,
  });

  const quickBooks = data?.quickBookOptions ?? [];

  return {
    quickBooks,
    loadingQuickBooks,
  };
};
