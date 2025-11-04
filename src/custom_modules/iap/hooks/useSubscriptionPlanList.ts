import { useQuery } from '@apollo/client';
import { SubscriptionPlan } from '../interfaces';
import { getSubscriptionPlans } from '../graphql';
import Constants from 'expo-constants';
import { useMemo } from 'react';
import { apiKeyClient } from '~/store/config/apolloClient';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useSubscriptionPlanList = () => {
  const { data, loading } = useQuery<{ getSubscriptionPlans: SubscriptionPlan[] }>(
    getSubscriptionPlans,
    {
      variables: {
        tenant: {
          tenantId,
        },
      },
      client: apiKeyClient,
    }
  );

  const sortedPlans = useMemo(() => {
    return data?.getSubscriptionPlans
      ? [...data.getSubscriptionPlans].sort((a, b) => a.order - b.order)
      : [];
  }, [data?.getSubscriptionPlans]);

  return { plans: sortedPlans, loading };
};
