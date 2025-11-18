import { useQuery, useReactiveVar } from '@apollo/client';
import { getTaskByUserQuery } from '../graphql/queries';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { ITask } from '../interfaces';
import { daySelection } from './dailySelectionVar';
import { subscriptionStatusData } from '~/store/subscription';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useTasksByUser = (today?: string) => {
  const { hasActiveSubscription } = useReactiveVar(subscriptionStatusData);

  const customer = useReactiveVar(userData);
  const selectedDay = useReactiveVar(daySelection);

  const { data, loading, error, refetch } = useQuery<{ getTasksByUser: ITask[] }>(
    getTaskByUserQuery,
    {
      variables: {
        tenant: {
          tenantId,
        },
        userId: customer?.id,
        date: today ?? selectedDay,
        userActiveTemplateId: hasActiveSubscription ?customer?.activeTemplateId: ""
      },
    }
  );

  return {
    tasks: data?.getTasksByUser ?? [],
    isLoading: loading,
    error,
    refetch,
  };
};
