import { useQuery } from '@apollo/client';
import { ENV_Vars } from '~/store/env';
import { QuickBookOption } from '../interfaces';
import { quickBookOptionsQuery } from '../graphql/queries';

export const useQuickBooks = () => {
  const { data, loading: loadingQuickBooks } = useQuery<{
    quickBookOptions: QuickBookOption[];
  }>(quickBookOptionsQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
    },
  });

  const quickBooks = data?.quickBookOptions ?? [];

  return {
    quickBooks,
    loadingQuickBooks,
  };
};
