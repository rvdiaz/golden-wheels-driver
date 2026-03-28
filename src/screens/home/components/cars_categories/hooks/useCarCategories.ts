import { useQuery } from '@apollo/client';
import { getCarTypesByTripQuery, getCarTypesQuery } from '../graphql/queries';
import { ENV_Vars } from '~/store/env';
import { BookingCartTypesPriceQueryInput, CarType } from '~/screens/trips/interfaces';

export const useCarCategories = ({
  queryInput,
}: {
  queryInput?: BookingCartTypesPriceQueryInput;
}) => {
  const { data, loading } = useQuery<{
    getCarTypes: CarType[];
  }>(getCarTypesQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
      returnAll: false,
    },
    skip: !!queryInput,
  });

  const { data: getCarTypesByTrip, loading: loadingGetCarTypesByTrip } = useQuery<{
    getCarTypesByTrip: CarType[];
  }>(getCarTypesByTripQuery, {
    variables: {
      tenant: ENV_Vars.tenant,
      input: queryInput,
    },
    skip: !queryInput,
  });

  const carCategories = data?.getCarTypes ?? [];
  const carCategoriesWithQuote = getCarTypesByTrip?.getCarTypesByTrip ?? [];

  return {
    carCategories,
    loading,
    carCategoriesWithQuote,
    loadingGetCarTypesByTrip,
  };
};
