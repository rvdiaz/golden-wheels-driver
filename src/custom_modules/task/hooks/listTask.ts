import { useQuery, useReactiveVar } from '@apollo/client';
import { getTaskByUserQuery } from '../graphql/queries';
import Constants from 'expo-constants';
import { userData } from '~/store/user';
import { ITask } from '../interfaces';
import { daySelection } from './dailySelectionVar';

const tenantId = Constants.expoConfig?.extra?.TENANTID;

export const useTasksByUser = () => {
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
        date: selectedDay,
        userActiveTemplateId: customer?.activeTemplateId,
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
