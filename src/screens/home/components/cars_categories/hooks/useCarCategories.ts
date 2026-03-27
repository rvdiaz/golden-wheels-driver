import { useQuery } from '@apollo/client';
import { getCarTypesQuery } from '../graphql/queries';
import { ENV_Vars } from '~/store/env';
import { CarType } from '~/screens/trips/interfaces';

export const useCarCategories = () => {
  const { data, error, loading } = useQuery<{
    getCarTypes: CarType[];
  }>(getCarTypesQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
      returnAll: false,
    },
  });
  const carCategories = data?.getCarTypes ?? [];

  return {
    carCategories,
    loading,
  };
};
