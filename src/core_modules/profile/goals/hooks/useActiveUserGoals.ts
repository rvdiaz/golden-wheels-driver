import Constants from 'expo-constants';
import { useQuery, useReactiveVar } from '@apollo/client';
import { getActiveUserGoals } from '../graphql/queries';
import { userData } from '~/store/user';
import { IGoalProgress } from '../interfaces';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useActiveUserGoals = () => {
  const user = useReactiveVar(userData);

  const { data, loading, error, refetch } = useQuery<{ getActiveUserGoals: IGoalProgress[] }>(
    getActiveUserGoals,
    {
      variables: {
        tenant: {
          tenantId,
        },
        userId: user?.id,
        templateId: user?.activeGoalsTemplateId,
      },
      fetchPolicy: 'network-only',
    }
  );

  return {
    goals: data?.getActiveUserGoals ?? [],
    isLoading: loading,
    error,
    refetch,
  };
};
